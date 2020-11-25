fluid.defaults("adam.synth.fmbell", {
    gradeNames: ["flock.synth"],
  
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
            add: 800
        },
        mul: 0
    },
  
    events: {
      strike: null    
    },
  
    listeners: {
      strike: {
        funcName: "adam.synth.fmbell.strike",
        args: ["{that}", "{arguments}.0"]
      }
    }

});

adam.synth.fmbell.strike = function(that, msg){
  let ampline = {          
    ugen: "flock.ugen.line",
    start: 1,
    end: 0,
    duration: 1
  };  
  let freqline = {
        ugen: "flock.ugen.xLine",
        rate: "control",
        start: 1000,
        end: 501,
        duration: 0.1 
    };
  that.set("bell.mul", ampline);
  that.set("bell.freq.freq", freqline);
};

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
        bellButton: {
          type: "adam.bellButton",
          container: "#bell-button",
          options: {
            bell: "{synth}"
          }
        },
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


fluid.defaults("adam.bellButton", {
  gradeNames: "adam.simpleButton",
  
  bell: null,
  
  listeners: {
    onAction: {
      funcName: "{that}.options.bell.events.strike.fire"
    }
  }
  
});

adam.composition();