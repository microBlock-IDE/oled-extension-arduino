({
    name: "OLED", // Category Name
    description: "Display text, number, image on OLED display",
    author: "ArtronShop",
    category: "Display",
    version: "1.0.0",
    icon: "/static/icon.png", // Category icon
    color: "#8b507c", // Category color (recommend some blocks color)
    blocks: [ // Blocks in Category
        {
            xml:
                `<block type="i2c128x64_display_begin">
                <value name="SDA">
                    <shadow type="math_number">
                        <field name="NUM">21</field>
                    </shadow>
                </value>
                <value name="SCL">
                    <shadow type="math_number">
                        <field name="NUM">22</field>
                    </shadow>
                </value>
            </block>`
        },
        {
            xml: `<block type="variables_set">
                        <field name="VAR">img1</field>
                        <value name="VALUE">
                            <block type="i2c128x64_create_image" inline="false"></block>
                        </value>
             </block>`
        },
        {
            xml:
                `<block type="i2c128x64_display_image">
                <value name="img">
                    <block type="variables_get">
                        <field name="VAR">img1</field>
                    </block>
                </value>
                <value name="x">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
                <value name="x">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
                <value name="y">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
                <value name="width">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
                <value name="height">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>`
        },
        "i2c128x64_display_clear",
        "i2c128x64_display_display",
        {
            xml:
                `<block type="i2c128x64_display_print">
                          <value name="text">
                            <shadow type="text">
                                <field name="TEXT">Hello!</field>
                            </shadow>
                          </value>
                          <value name="x">
                              <shadow type="math_number">
                                  <field name="NUM">0</field>
                              </shadow>
                          </value>
                          <value name="y">
                              <shadow type="math_number">
                                  <field name="NUM">0</field>
                              </shadow>
                          </value>
                          <value name="size">
                              <shadow type="math_number">
                                  <field name="NUM">1</field>
                              </shadow>
                          </value>
                      </block>`
        },
        {
            xml:
                `<block type="i2c128x64_display_draw_line">
                          <value name="x0">
                              <shadow type="math_number">
                                  <field name="NUM">10</field>
                              </shadow>
                          </value>
                          <value name="y0">
                              <shadow type="math_number">
                                  <field name="NUM">10</field>
                              </shadow>
                          </value>
                          <value name="x1">
                              <shadow type="math_number">
                                  <field name="NUM">100</field>
                              </shadow>
                          </value>
                          <value name="y1">
                              <shadow type="math_number">
                                  <field name="NUM">50</field>
                              </shadow>
                          </value>
                      </block>`
        },
        {
            xml:
                `<block type="i2c128x64_display_draw_rect">
                          <value name="x">
                              <shadow type="math_number">
                                  <field name="NUM">10</field>
                              </shadow>
                          </value>
                          <value name="y">
                              <shadow type="math_number">
                                  <field name="NUM">10</field>
                              </shadow>
                          </value>
                          <value name="width">
                              <shadow type="math_number">
                                  <field name="NUM">50</field>
                              </shadow>
                          </value>
                          <value name="height">
                              <shadow type="math_number">
                                  <field name="NUM">30</field>
                              </shadow>
                          </value>
                      </block>`
        },
        {
            xml:
                `<block type="i2c128x64_display_draw_circle">
                          <value name="x">
                              <shadow type="math_number">
                                  <field name="NUM">64</field>
                              </shadow>
                          </value>
                          <value name="y">
                              <shadow type="math_number">
                                  <field name="NUM">32</field>
                              </shadow>
                          </value>
                          <value name="r">
                              <shadow type="math_number">
                                  <field name="NUM">20</field>
                              </shadow>
                          </value>
                      </block>`
        },
        /* {
            xml:
                `<block type="i2c128x64_display_draw_progress_bar">
                          <value name="x">
                              <shadow type="math_number">
                                  <field name="NUM">0</field>
                              </shadow>
                          </value>
                          <value name="y">
                              <shadow type="math_number">
                                  <field name="NUM">32</field>
                              </shadow>
                          </value>
                          <value name="width">
                              <shadow type="math_number">
                                  <field name="NUM">120</field>
                              </shadow>
                          </value>
                          <value name="height">
                              <shadow type="math_number">
                                  <field name="NUM">30</field>
                              </shadow>
                          </value>
                          <value name="progress">
                              <shadow type="math_number">
                                  <field name="NUM">50</field>
                              </shadow>
                          </value>
                      </block>`
        }, */
        {
            xml:
                `<block type="i2c128x64_display_draw_pixel">
                          <value name="x">
                              <shadow type="math_number">
                                  <field name="NUM">64</field>
                              </shadow>
                          </value>
                          <value name="y">
                              <shadow type="math_number">
                                  <field name="NUM">32</field>
                              </shadow>
                          </value>    
                      </block>`
        },
        "i2c128x64_display_width",
        "i2c128x64_display_height",
    ],
    supportArduinoPlatform: true,
    depends: [ // Arduino library
        "Adafruit SSD1306@2.5.9",
        "Adafruit GFX Library@1.11.9",
        "Adafruit BusIO@1.15.0"
    ]
});
