const floyd_steinberg = (imageData, w) => {
  var imageDataLength = imageData.length;
  var lumR = [],
    lumG = [],
    lumB = [];
  var newPixel, err;
  var i;
  for (i = 0; i < 256; i++) {
    lumR[i] = i * 0.299;
    lumG[i] = i * 0.587;
    lumB[i] = i * 0.110;
  }
  // Greyscale luminance (sets r pixels to luminance of rgb)
  for (i = 0; i <= imageDataLength; i += 4) {
    imageData[i] = Math.floor(lumR[imageData[i]] + lumG[imageData[i + 1]] +
      lumB[imageData[i + 2]]);
  }
  for (let currentPixel = 0; currentPixel <=
    imageDataLength; currentPixel += 4) {
    // threshold for determining current pixel's conversion to a black or white pixel
    newPixel = imageData[currentPixel] < 150
      ? 0
      : 255;
    err = Math.floor((imageData[currentPixel] - newPixel) / 23);
    imageData[currentPixel + 0 * 1 - 0] = newPixel;
    imageData[currentPixel + 4 * 1 - 0] += err * 7;
    imageData[currentPixel + 4 * w - 4] += err * 3;
    imageData[currentPixel + 4 * w - 0] += err * 5;
    imageData[currentPixel + 4 * w + 4] += err * 1;
    // Set g and b values equal to r (effectively greyscales the image fully)
    imageData[currentPixel + 1] = imageData[currentPixel +
      2] = imageData[currentPixel];
  }
  return imageData;
};

Blockly.Blocks['i2c128x64_display_begin'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("OLED begin address")
      .appendField(new Blockly.FieldTextInput("0x3C"), "ADDR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_create_image"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("create image from PNG file");
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAIAAABdtOgoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ/SURBVHhe7ZbbdQIxDES3LgraeqiGZiiG2JLWHhmbx08Gkrk/kWU9GR/IdhNUJAAZCUBGApCRAGQkABkJQEYCkJEAZCQAGQlARgKQkQBkJAAZCUBGApCRAGQkABkJQEYCkJEAZCQAGQlARgKQkQBkJACZFwW47Nu2nc7XOP4ZbK9tv8SRgASQAP+bhQDX86k+jYo9jxDgbA+mAG/GH5GDEs393dtLQLNRZL9qTnwHs/oeHpUh18xjfHzvkBAxF/NUirf16DnQts+KsxTiwos7PXZgKkDesxrRweZw20dCGxZe+aHw9bzH33obC9p92A4WhfRF/VTszj+UrkBCxKT4sVfxm+s+8a492pO9GjMB+p6N5OqHHOk96/Ghv18U0pzTSWfdVvVTte5GMwMJKSYVyt2CPAymQbW2iUW3EzIRYMg10gztkGaGi5X/MB3rAOfGMGiqalWW9dPoEJX8CFykoikBxh/m7cUH65W9nKUA0TDAGeCQ3DD1yn/QW+TIORaznU5tu2X91Kk3mUwQwAWEDwmtG3r7CO4NjqFe2cuYfQWlUeA3YFIc/fPx0F+s8PV7s45VF7QVI/tJX7fd9CAMScCFm5OavZl5PcKrD04EJnnI9Ef4GKAC/Y4u6dAjC9Bv7gdvj/VZG5OhIw3XXPVtxeIfGsvx4GVhu3AzWqQE2LePuu/FHJ1Ga/N8r8JCgE8DPoNPI422VHrJdwjgb+mdvX6N/JG/P+g3COA7fubnX8lfNW+O+SVfQX8XCUBGApCRAGQkABkJQEYCkJEAZCQAGQlARgKQkQBkJAAZCUBGApCRAGQkABkJQEYCkJEAZCQAGQlARgKQkQBkJACV2+0HImEfdtax+UEAAAAASUVORK5CYII=",
        128,
        64,
        "click to upload",
        function (e) {
          let myself = this;
          let id = this.sourceBlock_.id.toUpperCase();
          const dialogOptions = {
            filters: [{ name: "Images PNG", extensions: ["png"] }],
            properties: ["openFile"]
          };
          dialog.showOpenDialog(dialogOptions).then(({ canceled, filePaths }) => {
            if (canceled) {
              return;
            }
            console.log(filePaths);
            if (filePaths?.[0]) {
              const imageFileName = filePaths[0];
              //--- resize image ---//
              let image = nativeImage.createFromPath(imageFileName);
              let size = image.getSize();
              if (size.width > 128) {
                image = image.resize({ width: 128 });
                size = image.getSize();
              }
              if (size.height > 64) {
                image = image.resize({ height: 64 });
                size = image.getSize();
              }
              var buff = image.getBitmap();
              //---- dithering image ----//
              floyd_steinberg(buff, size.width);
              //---- display image ----//
              myself.sourceBlock_.inputList[2].fieldRow[0].setValue(`image size ${size.width} x ${size.height}`);
              myself.sourceBlock_.inputList[2].fieldRow[0].init();
              myself.setValue(image.toDataURL());
              myself.init();
            }
          });
        },
        true));
    this.appendDummyInput().appendField("image size 128 x 64");

    this.setOutput(true, "std::vector<uint8_t>");
    this.setColour("#2980B9");
    this.setTooltip(
      "create image from PNG file (for best quality result please use size within 128x64 pixel otherwise, it'll resize)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_image"] = {
  init: function () {
    this.appendValueInput("img")
      .setCheck("std::vector<uint8_t>")
      .appendField("OLED draw image");
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField(" at (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(",Y");
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(") width");
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField("height");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("display image to display");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_print"] = {
  init: function () {
    this.appendValueInput("text")
      .appendField("OLED display text");
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField("at (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(", Y");
      this.appendValueInput("size")
      .setCheck("Number")
      .appendField(", Size");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("display string at x,y");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_display"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("OLED display");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("display everything to screen");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_clear"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("OLED clear display");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("clear display");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_draw_line"] = {
  init: function () {
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField("OLED draw line from (X");
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(",Y");
    this.appendValueInput("x1")
      .setCheck("Number")
      .appendField(")  to  (X");
    this.appendValueInput("y1")
      .setCheck("Number")
      .appendField(",Y");
    this.appendDummyInput()
      .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("draw line from (x0,y0) to (x1,y1)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_draw_rect"] = {
  init: function () {
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField("OLED draw rectangle at (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(", Y");
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(")  width");
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField(" height");
    this.appendDummyInput()
      .appendField(" fill ")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("draw rectangle to display");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_draw_circle"] = {
  init: function () {
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField("OLED draw circle at (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(",Y");
    this.appendValueInput("r")
      .setCheck("Number")
      .appendField(")  radius");
    this.appendDummyInput()
      .appendField(" fill")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("draw circle on screen");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_draw_progress_bar"] = {
  init: function () {
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField("OLED draw progress bar at (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(",Y");
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(")  width");
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField("  height");
    this.appendValueInput("progress")
      .setCheck("Number")
      .appendField("  progress");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("draw progress bar on the screen");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_draw_pixel"] = {
  init: function () {
    this.appendValueInput("x")
      .setCheck("Number")
      .appendField("OLED set pixel (X");
    this.appendValueInput("y")
      .setCheck("Number")
      .appendField(",Y");
    this.appendDummyInput()
      .appendField(")  white color")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#2980B9");
    this.setTooltip("set pixel color");
    this.setHelpUrl("");
  }
};


Blockly.Blocks["i2c128x64_display_width"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("OLED get screen width");
    this.setOutput(true, "Number");
    this.setColour("#2980B9");
    this.setTooltip("get screen size width in pixel");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["i2c128x64_display_height"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("OLED get screen height");
    this.setOutput(true, "Number");
    this.setColour("#2980B9");
    this.setTooltip("get display screen height in pixel");
    this.setHelpUrl("");
  }
};