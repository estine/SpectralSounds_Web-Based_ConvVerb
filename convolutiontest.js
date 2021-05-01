<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
// MY audio classes
class Custom_BufferSource {
    
    constructor(context,filepath=null) {
        this.context = context;
        this.buffer = null;
        this.filepath = filepath;
        this.destination = null;
        this.is_playing = false;
    }
    
    init()
    {
        //create node
        this.destination = this.context.destination;
        this.createNode();
    }
    
    createNode()
    {
        this.node = this.context.createBufferSource();
    }
    
    loadSound(url) {
        let request = new XMLHttpRequest();
        // was this.filepath
        url = this.filepath +"/"+ url;
        request.open('get', url, true);
        request.responseType = 'arraybuffer';
        let thisBuffer = this;
        request.onload = function() {
            thisBuffer.context.decodeAudioData(request.response, function(buffer) {
                   thisBuffer.buffer = buffer;
                   thisBuffer.loaded()
                   });
        };
        request.send();
    };
    
    loaded() {
        source_sound_loaded();
    }
    
    connect(destination)
    {
        this.destination = destination;
    }
    
    start(loop=false){
        this.is_playing = true;
        this.createNode();
        this.node.buffer = this.buffer;
        this.node.loop = loop
        this.node.connect(this.destination);
        this.node.start();
    }
    
    stop()
    {
        if (this.is_playing == true)
        {
            this.node.stop(0);
            this.is_playing = false;
        }
        
    }
}

class CustomConvolver extends Custom_BufferSource {
    
    createNode()
    {
        this.node = this.context.createConvolver();
    }
    
    loaded() {
        this.node.buffer = this.buffer;
    }
    
    start(loop=false){
        var node_temp = this.context.createBufferSource();
        node_temp.buffer = this.buffer;
        node_temp.loop = loop
        node_temp.connect(this.context.destination);
        node_temp.start();
    }
}

//UI MANAGEMENT

function source_sound_loaded()
{
    document.getElementById("play_button").classList.remove("disabled");
}

document.addEventListener("input", function (event) {
      if (event.target.id == "change_source")
      {
      document.getElementById("play_button").classList.remove("hidden");
      document.getElementById("play_button").classList.add("disabled");
      document.getElementById("stop_button").classList.add("hidden");
      custom_buffersource.stop(0);
      custom_buffersource.loadSound(event.target.value);
      }
      if (event.target.id == "change_convoluer")
      {
      custom_convolver.loadSound(event.target.value);
      }
      if (event.target.id == "change_convoluer_state")
      {
      gain1 = 1-gain1;
      gainNode1.gain.setValueAtTime(gain1, context.currentTime);
      gainNode2.gain.setValueAtTime(1-gain1, context.currentTime);
      }
      },
     false);

document.addEventListener("click", function (event) {
      if (event.target.id == "play_button")
      {
      document.getElementById("play_button").classList.add("hidden");
      document.getElementById("stop_button").classList.remove("hidden");
      custom_buffersource.start(true);
      }
      if (event.target.id == "stop_button")
      {
      document.getElementById("stop_button").classList.add("hidden");
      document.getElementById("play_button").classList.remove("hidden");
      custom_buffersource.stop();
      }
      if (event.target.id == "ir_play_button")
      {
      custom_convolver.start(0);
      }
      if (event.target.id == "drywet_ui")
      {
      value = event.target.value;
      gainNode_dry.gain.setValueAtTime(1-value, context.currentTime);
      gainNode_wet.gain.setValueAtTime(value, context.currentTime);
      }
      }, false);


var gain1= 1;
var context = new (window.AudioContext || window.webkitAudioContext)();
var inputNode, gainNode1, gainNode2,gainNode_dry,gainNode_wet;
var custom_buffersource =  new Custom_BufferSource(context,"https://spectralsounds.org/wp-content/uploads/");
var custom_convolver =  new CustomConvolver(context,"https://spectralsounds.org/wp-content/uploads/");

custom_convolver.init();
custom_buffersource.init();

document.addEventListener("DOMContentLoaded", function(){
                          
      inputNode = context.createGain();
      gainNode1 = context.createGain();
      gainNode2 = context.createGain();
      gainNode_dry = context.createGain();
      gainNode_wet = context.createGain();
      
      element = document.getElementById("change_source");
      custom_buffersource.loadSound(element.value);
      element = document.getElementById("change_convoluer");
      custom_convolver.loadSound(element.value);
      
      custom_buffersource.connect(inputNode);
      
      //enable
      inputNode.connect(gainNode_dry);
      inputNode.connect(gainNode_wet);
      gainNode_wet.connect(custom_convolver.node);
      gainNode_dry.connect(gainNode1);
      custom_convolver.node.connect(gainNode1);
      gainNode1.connect(context.destination);
      
      //disable
      inputNode.connect(gainNode2);
      gainNode2.connect(context.destination);
      
      //set gain value
      gainNode_dry.gain.setValueAtTime(0, context.currentTime);
      gainNode_wet.gain.setValueAtTime(1, context.currentTime);
      gainNode1.gain.setValueAtTime(gain1, context.currentTime);
      gainNode2.gain.setValueAtTime(1-gain1, context.currentTime);
      });</script>
<!-- end Simple Custom CSS and JS -->
