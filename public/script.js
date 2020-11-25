fluid.defaults("adam.synth.fmbell", {
    gradeNames: ["flock.synth"],

    harmonicityRatio: 2,
    frequency: 200,
    mul: 0.5,
    
    ampEnv: {
        ugen: "flock.ugen.line",
        start: "{that}.options.mul",
        end: 0, 
        duartion: 1
    },
    freqEnv: {
        ugen: "flock.ugen.xLine",
        rate: "control",
        start: 1000,
        end: 501,
        duration: 0.1 
    },

    synthDef:{
        id: "bell",
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.sinOsc",
            freq: {
                ugen: "flock.ugen.xLine",
                rate: "control",
                start: 9000,
                end: 501,
                duration: 0.05
            },
            mul: 200,
            add: "{that}.options.frequency"
        },
        mul: 0
    },

    events: {
        strike: null    
    },

    listeners: {
        "strike.setAmp": {
            funcName: "{that}.set",
            args: ["bell.mul", "{that}.options.ampEnv"]
        },
        "strike.setFreq": {
            funcName: "{that}.set",
            args: ["bell.freq.freq", "{that}.options.freqEnv"]
        }
    }

});

// Define an Infusion component that connects to the teensy MIDI controller
fluid.defaults("adam.midi.teensy",{
  gradeNames: ["flock.midi.connection"],
  openImmediately: true,
  sysex: true,
  ports: {
      input: {
        name: "Soft MIDI"
      }
  },
  listeners: {
      /*
    onReady: {
      func: console.log,
      args: "{that}"
    },
    */
    control: {
      funcName: "adam.midi.teensy.controlHandler",
      args: ["{that}", "{arguments}.0"]
    },
  },
  events: {
    pressure1: null,
    pressure2: null
  }
});

adam.midi.teensy.controlHandler = function(that, msg){
  
  if (msg.number === 12){
    that.events.pressure1.fire(msg.value);
  }  
  if( msg.number === 13){
    that.events.pressure2.fire(msg.value);
  }
};

// Define an Infusion component that represents your composition.
fluid.defaults("adam.composition", {
    gradeNames: ["fluid.component"],

    components: {
        controller: {
          type: "adam.midi.teensy"
        },
        bell1: {
          type: "adam.synth.fmbell"
        },
        bell2: {
            type: "adam.synth.fmbell",
            options: {
                frequency: 300
            }
        },
        bell3: {
            type: "adam.synth.fmbell",
            options: {
                frequency: 400
            }
        },
        bell4: {
            type: "adam.synth.fmbell",
            options: {
                frequency: 600
            }
        },
        bell5: {
            type: "adam.synth.fmbell",
            options: {
                frequency: 800
            }
        },
        bell6: {
            type: "adam.synth.fmbell",
            options: {
                frequency: 1600
            }
        },
        playButton: {
          type: "flock.ui.enviroPlayButton",
          container: "#play-button"
        },
        bell1Button: {
          type: "adam.bellButton",
          container: "#bell1-button",
          options: {
              bell: "{bell1}"
          }
        },
        bell2Button: {
            type: "adam.bellButton",
            container: "#bell2-button",
            options: {
                bell: "{bell2}"
            }
        },
        bell3Button: {
            type: "adam.bellButton",
            container: "#bell3-button",
            options: {
                bell: "{bell3}"
            }
        },
        bell4Button: {
            type: "adam.bellButton",
            container: "#bell4-button",
            options: {
                bell: "{bell4}"
            }
        },
        bell5Button: {
            type: "adam.bellButton",
            container: "#bell5-button",
            options: {
                bell: "{bell5}"
            }
        },
        bell6Button: {
            type: "adam.bellButton",
            container: "#bell6-button",
            options: {
                bell: "{bell6}"
            }
        },
        bell1Drop: {
            type: "adam.belldrop",
            container: "#bell1-receiver",
            options: {
                bell: "{bell1}"
            }
        },
        bell2Drop: {
            type: "adam.belldrop",
            container: "#bell2-receiver",
            options: {
                bell: "{bell2}"
            }
       },
        bell3Drop: {
            type: "adam.belldrop",
            container: "#bell3-receiver",
            options: {
                bell: "{bell3}"
            }
        },
        bell4Drop: {
            type: "adam.belldrop",
            container: "#bell4-receiver",
            options: {
                bell: "{bell4}"
            }
        },
        bell5Drop: {
            type: "adam.belldrop",
            container: "#bell5-receiver",
            options: {
                bell: "{bell5}"
            }
        },
        bell6Drop: {
            type: "adam.belldrop",
            container: "#bell6-receiver",
            options: {
                bell:  "{bell6}"
            }
        }

    },

    listeners: {
        "{controller}.events.noteOn": {
            func: "adam.midi.teensy.noteOnHandler",
            args: ["{that}", "{arguments}.0"]
        },
        onCreate: {
            func: console.log,
            args: "{that}"
        },
    /*

        "{controller}.events.pressure1": {
            funcName: "{synth}.set",
            args: ["lefty.freq", "{arguments}.0"]
        },
        "{controller}.events.pressure2": {
            funcName: "{synth}.set",
            args: ["righty.freq", "{arguments}.0"]
        }
        */
    }
});

adam.midi.teensy.noteOnHandler = function(that, msg){

    switch (msg.note % 12 ){
        case 0:
            that.bell1.events.strike.fire();
            break;
        case 2: 
            that.bell2.events.strike.fire();
            break;
        case 4: 
            that.bell4.events.strike.fire();
            break;
        case 5:
            that.bell4.events.strike.fire();
            break;
        case 7: 
            that.bell5.events.strike.fire();
            break;
        case 9:
            that.bell6.events.strike.fire();
            break;
        default: 
            break;
    }
};

fluid.defaults("adam.simpleButton", {
    gradeNames: "fluid.viewComponent",
    
    events: {
        onAction: null
    },
    
    listeners: {
        "onCreate.bindButton": {
            this: "{that}.container",
            method: "click",
            args: ["{that}.events.onAction.fire"]
        }
    }
});

fluid.defaults("adam.jqueryui.draggable", {
    gradeNames: "fluid.viewComponent",

    listeners: {
        "onCreate.makeDraggable": {
            this: "{that}.container",
            method: "draggable",
            args: {"revert": true}
        }
    }
});

fluid.defaults("adam.jqueryui.droppable", {
    gradeNames: "fluid.viewComponent",

    events: {
        drop: null
    },

    listeners: {
        "onCreate.makeDroppable": {
            this: "{that}.container",
            method: "droppable",
            args: {"drop": "{that}.events.drop.fire"}
        },
    },

});

fluid.defaults("adam.belldrop", {
    gradeNames: "adam.jqueryui.droppable",

    bell : null,

    listeners: {
        drop: {
            funcName: "{that}.options.bell.events.strike.fire"
        }
    }

});

fluid.defaults("adam.bellButton", {
  gradeNames: ["adam.simpleButton", "adam.jqueryui.draggable"],
  
  bell: null,
  
  listeners: {
    onAction: {
      funcName: "{that}.options.bell.events.strike.fire"
    }
  }
  
});

adam.composition();
