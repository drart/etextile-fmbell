fluid.defaults("adam.synth.fmbell", {
    gradeNames: ["flock.synth"],

    harmonicityRatio: 2,
    frequency: 800,
    
    ampEnv: {
        ugen: "flock.ugen.line",
        start: 1,
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
    onReady: {
      func: console.log,
      args: "{that}"
    },
    control: {
      funcName: "adam.midi.teensy.controlHandler",
      args: ["{that}", "{arguments}.0"]
    }
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
        enviro: {
            type: "flock.enviro"
        },
        /*
        controller: {
          type: "adam.midi.teensy"
        },
        */
        synth: {
          type: "adam.synth.fmbell"
        },
        playButton: {
          type: "flock.ui.enviroPlayButton",
          container: "#play-button"
        },
        bell1Button: {
          type: "adam.bellButton",
          container: "#bell1-button",
          options: {
            bell: "{synth}"
          }
        },
        bell2Button: {
            type: "adam.bellButton",
            container: "#bell2-button",
            options: {
                bell: "{synth}"
            }
        },
        /*
        bell1Drop: {
            type: "adam.jqueryui-droppable",
            container: "#bell1-receiver"
            // add synth
        }
        */

    },

    listeners: {
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
            method: "draggable"
        }
    }
});

fluid.defaults("adam.jqueryui.dropable", {
    gradeNames: "fluid.viewComponent",
    listeners: {
        "onCreate.makeDraggable": {
            this: "{that}.container",
            method: "droppable"
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
