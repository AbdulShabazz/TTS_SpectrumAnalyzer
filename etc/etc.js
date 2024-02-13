// Math.pow(10, current.amplitude_rdBFS / 20);

                //populateFrequencyBandAmplitudes(updatedFrequencyBands);
                for (const fband of currentFrequencyBand) {
                    updatedFrequencyBands.push({ x: fband.frequency_hz, y: fband.amplitude_rdBFS });
                }

for (let channel = 0; channel < audioContext.numberOfChannels; ++channel) {
    const getFloatFrequencyData = analyser.getFloatFrequencyData(LChannelAudio);

    let currentFrequencyBandAmplitudes = [];
    if (peakAmplitudes[0].frequency_hz != currentFrequencyBand[0].frequency_hz) {
        swapOutFrequencyBands();
        populateFrequencyBandAmplitudes(currentFrequencyBandAmplitudes);
    } else {
        // Update peakAmplitudes and or apply decay
        for (let i = 0; i < nextAmplitudes.length; ++i) {
            updatePeak(peakAmplitudes[i], currentFrequencyBandAmplitudes[i], dynamicRange);
            currentFrequencyBandAmplitudes.push({ x: nextAmplitudes[i].frequency_hz, y: nextAmplitudes[i].amplitude_rdBFS });
        }
    }
}

function updateChart() {
    requestAnimationFrame(updateChart);
    // Get the frequency data
    analyser.getByteFrequencyData(dataArray);

    // Normalize and reduce the array to 24 bands
    let step = Math.floor(dataArray.length / 24);
    for (let i = 0; i < 24; ++i) {
        let value = 0;
        for (let j = 0; j < step; j++) {
            value += dataArray[(i * step) + j];
        }
        value = value / step;
        myChart.data.datasets[0].data[i] = value;
    }

    // Update the chart
    myChart.update();
}

// Start the animation
//updateChart();

// Todo: Call `updateSpectrum` at your desired frame rate

//audioContext.bitDepth = g_bitDepth;

            //console.info(audioBuffer);
            //g_audioBuffer = audioBuffer;
            //const bitsPerSample = audioBuffer.bitsPerSample;
            // You now have access to the audioBuffer
            // which you can manipulate or play as needed
            //const op = parseSpectrum(audioPlayer.src);
            /*
            let op = {};
            op.spectrumAvailable = true;
            op.buffer = audioBuffer.get;
            if (op.spectrumAvailable) {
                updateSpectrum(op.buffer);
            }
            */

/////////////////////////////////////////////////////

border-width: 5px;
border-style: solid;
border-color: #333 transparent transparent transparent transparent;

.info-icon {
    width: 12px;
    height: 12px;
    background-color: #007bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    font-weight: bold;
}
.tooltip {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
}
.info-icon:hover, .tooltip {
    visibility: visible;
    opacity: 1;
}
.info-icon + .tooltip:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}



wavHeader.getUint32(0,true).toString(16);

    
                    const startPos = 0 + 4; // Position of sample rate in the STREAMINFO FLAC header (a 32-bit field)
                    const bitsPerSampleFlag = (audioHeader.getUint8(startPos, platformEndianness)  & 0x70) >> 4;

                    /*
                    fLaC is designed for streaming, so its 3-bit (PCM) 
                    bit depth field is encoded in the frame header of the audio packet */
                    const bitsPerSampleFlag = audioHeader.getUint8(16, platformEndianness);

offlineAudioCtx = {};

function uploadFileForAnimation(file) {
    const fileSizeInKB = audioPlayer.size; /* file size in kilobytes (kB) */
    const durationInSeconds = audioElement.duration; // as obtained from the audio element

    const bitrateInKbps = (fileSizeInKB * 8) / durationInSeconds;

    // 1. Create OfflineAudioContext
    offlineAudioCtx = new OfflineAudioContext(2, 44100 * audioPlayer.duration, 44100);

    // 2. Fetch the audio file
    fetch(audioPlayer.src) //'path/to/your/audio/file.mp3'
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => offlineAudioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            // 3. Decode the audio data and create an AnalyserNode
            const source = offlineAudioCtx.createBufferSource();
            source.buffer = audioBuffer;

            const analyser = offlineAudioCtx.createAnalyser();
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);
            analyser.connect(offlineAudioCtx.destination); // Connect to the destination

            source.start();

            // 4. Render the data
            offlineAudioCtx.startRendering().then(renderedBuffer => {
                // Here you can process the renderedBuffer, but you won't have real-time data
                // You might have to process the data in chunks and update the chart accordingly
            });
        });
}

function linearAmplitudeFromdBFS(dBFS) {
    return Math.pow(10, dBFS / 20);
}

function dBFSTolinearAmplitude(dBFS) {
    return Math.pow(10, dBFS / 20);
}

function dBFSFromLinearAmplitude(amplitude) {
    return 20 * Math.log10(amplitude);
}

function linearAmplitudeToDBFS (amplitude) {
    return 20 * Math.log10(amplitude);
}

/**
@brief Compute the endianness of the operating system.
@details Compute the endianness of the operating system. */
function verifyPlatformIsLittleEndian() {
    let buffer = new ArrayBuffer(2);
    let uint8Array = new Uint8Array(buffer);
    let uint16array = new Uint16Array(buffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if (uint16array[0] === 0xBBAA) {
        return true; /* 'little-endian' */;
    } else if (uint16array[0] === 0xAABB) {
        return false; /* 'big-endian' */;
    } else throw new Error( "Unknown endianness.");
}

// Custom function to read 3 bytes as 24-bit integer
DataView.prototype.getUint24 = function(offset, isLittleEndian) {
    const bytes = isLittleEndian
        ? [this.getUint8(offset), this.getUint8(offset + 1), this.getUint8(offset + 2)]
        : [this.getUint8(offset + 2), this.getUint8(offset + 1), this.getUint8(offset)];
    return (bytes[0] << 16) + (bytes[1] << 8) + bytes[2];
};

// Custom function to read 36 bits as integer (considering JavaScript Number precision)
DataView.prototype.getUint36 = function(offset, isLittleEndian) {
    const bytes = isLittleEndian
        ? [this.getUint8(offset), this.getUint8(offset + 1), this.getUint8(offset + 2), this.getUint8(offset + 3), this.getUint8(offset + 4)]
        : [this.getUint8(offset + 4), this.getUint8(offset + 3), this.getUint8(offset + 2), this.getUint8(offset + 1), this.getUint8(offset)];
    // Combine the 36 bits. Note: JavaScript bitwise operations are 32-bit, hence the separation
    return (bytes[0] * Math.pow(2, 28)) + (bytes[1] << 20) + (bytes[2] << 12) + (bytes[3] << 4) + (bytes[4] >> 4);
};

/** 
@brief extracts the .FLAC metadata from a buffer.
@details extracts the .FLAC metadata from a buffer.
@param arrayBuffer - The buffer to convert.
@returns The .FLAC file Metadata.*/
function extractFlacMetadata(arrayBuffer) {
    const isLittleEndian = verifyPlatformIsLittleEndian();
    const dataView = new DataView(arrayBuffer);
    let offset = 4; // Usually, metadata starts after the 'fLaC' marker

    // Read STREAMINFO block header (assuming it's the first block)
    const blockHeader = dataView.getUint32(offset, isLittleEndian);
    offset += 4;
    
    const blockType = blockHeader >> 24; // First byte is block type
    const blockSize = blockHeader & 0x00FFFFFF; // Last three bytes are block size

    if (blockType !== 0) { // 0 is the type for STREAMINFO
        throw new Error("First metadata block is not STREAMINFO");
    }

    // Read STREAMINFO block data
    const minBlockSize = dataView.getUint16(offset, isLittleEndian);
    offset += 2;

    const maxBlockSize = dataView.getUint16(offset, isLittleEndian);
    offset += 2;

    const minFrameSize = dataView.getUint24(offset, isLittleEndian); // Custom function needed to read 3 bytes
    offset += 3;

    const maxFrameSize = dataView.getUint24(offset, isLittleEndian); // Custom function needed to read 3 bytes
    offset += 3;

    const sampleRate = dataView.getUint24(offset, isLittleEndian);
    offset += 3;

    const channelSampleDepth = dataView.getUint8(offset);
    const channels = (channelSampleDepth >> 4) + 1;
    const bitsPerSample = ((channelSampleDepth & 0x0F) << 1) + 1;
    offset += 1;

    const totalSamples = dataView.getUint36(offset, isLittleEndian); // Custom function needed to read 36 bits (4.5 bytes)
    offset += 4.5;

    // You can calculate duration like this
    const duration = totalSamples / sampleRate;

    return {
        minBlockSize,
        maxBlockSize,
        minFrameSize,
        maxFrameSize,
        sampleRate,
        channels,
        bitsPerSample,
        totalSamples,
        duration
    };
}

/** 
@brief converts a buffer to WAV audio.
@details Converts a buffer to WAV audio.
@param buffer - The buffer to convert.
@returns The WAV file as a Uint8Array.*/
function etractWAVMetadata(buffer) {
    const numberOfChannels = buffer.length;
    const sampleRate = buffer[0].sampleRate;
    const totalFrames = buffer[0].length;
    const bitsPerSample = buffer[0].bitsPerSample;
    const byteOffset = buffer[0].bitsPerSample / 8; // Calculate byte offset based on bits per sample
    const maxIntN = Math.pow(2, bitsPerSample - 1) - 1; // 2^23 - 1 = 8_388_607; preserve the sign bit
    const littleEndianFlag = verifyPlatformIsLittleEndian(); // true for little-endian, false for big-endian

    const blockAlign = numberOfChannels * byteOffset;

    const dataChunkSize = totalFrames * numberOfChannels * byteOffset;
    const byteRate = sampleRate * blockAlign;
    const pcm_header_offset = 44;

    // Create a buffer to hold the WAV file data
    let wavBuffer = new ArrayBuffer(pcm_header_offset + dataChunkSize);

    // Write WAV container headers; (code to write the 'RIFF', 'WAVE', 'fmt ', 'data' chunk headers, etc.)
    const pcm_wav_header = 44;
    let current_byte_offset = 0;
    let view = new DataView(wavBuffer);

    // Write the PCM chunk data
    let writeChunk = writeInt8;
    switch (buffer[0].bitsPerSample) {
        case 8:
            writeChunk = writeInt8;
            break;
        case 16:
            writeChunk = writeInt16;
            break;
        case 24:
            writeChunk = writeInt24;
            break;
        case 32:
            writeChunk = writeInt32;
            break;
        case 64:
            writeChunk = writeInt64;
            break;
    }

    // Write the 'RIFF' audio
    let nextChunk = 0;
    for (let i = 0; i < totalFrames; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            let sample = Math.max(-maxIntN, Math.min(maxIntN, buffer[channel][i])); // clamp
            writeChunk(view, pcm_wav_header + nextChunk, sample, littleEndianFlag);
            nextChunk += byteOffset;
        }
    }

    // Writing the 'RIFF' chunk descriptor
    current_byte_offset = writeString(view, current_byte_offset, 'RIFF', littleEndianFlag); // ChunkID 'RIFF' (big-endian)
    //view.setUint32(4, 36 + dataChunkSize, true); // File size - 8 bytes
    current_byte_offset = writeUint32(view, current_byte_offset, pcm_header_offset - current_byte_offset + dataChunkSize, littleEndianFlag); // File size - 8 bytes
    //writeString(view, 8, 'WAVE');
    current_byte_offset = writeString(view, current_byte_offset, 'WAVE', littleEndianFlag);
    //writeString(view, 12, 'fmt '); // Writing the 'fmt ' sub-chunk
    current_byte_offset = writeString(view, current_byte_offset, 'fmt ', littleEndianFlag);
    //view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    current_byte_offset = writeUint32(view, current_byte_offset, 16, littleEndianFlag); // Sub-chunk size (16 for PCM)
    //view.setUint16(20, 1, true); // Audio format (1 for PCM)
    current_byte_offset = writeUint16(view, current_byte_offset, 1, littleEndianFlag); // Audio format (1 for PCM)
    //view.setUint16(22, numberOfChannels, true);
    current_byte_offset = writeUint16(view, current_byte_offset, numberOfChannels, littleEndianFlag);
    //view.setUint32(24, sampleRate, true);
    current_byte_offset = writeUint32(view, current_byte_offset, sampleRate, littleEndianFlag);
    //view.setUint32(28, byteRate, true);
    current_byte_offset = writeUint32(view, current_byte_offset, byteRate, littleEndianFlag);
    //view.setUint16(32, blockAlign, true);
    current_byte_offset = writeUint16(view, current_byte_offset, blockAlign, littleEndianFlag);
    //view.setUint16(34, bitsPerSample, true);
    current_byte_offset = writeUint16(view, current_byte_offset, bitsPerSample, littleEndianFlag);

    // Writing the 'data' sub-chunk.. //

    //writeString(view, 36, 'data');
    current_byte_offset = writeString(view, current_byte_offset, 'data', littleEndianFlag);
    //view.setUint32(40, dataChunkSize, true);
    current_byte_offset = writeUint32(view, current_byte_offset, dataChunkSize, littleEndianFlag);

    return {
        minBlockSize,
        maxBlockSize,
        minFrameSize,
        maxFrameSize,
        sampleRate,
        channels,
        bitsPerSample,
        totalSamples,
        duration,
        wavBuffer
    };
}

function isSpectrumParsable(buffer) {
    switch (audioPlayer.type) {
    
    }
}

function parseSpectrum(buffer) {
    let format = "-";
    let spectrumAvailable = true;
    let buff = new Float32Array(0);
    switch (isSpectrumParsable(buffer)) {
        case 'wav':
            format = 'wav';
            buff = extractWAVMetadata(buffer);
        case 'flac':
            format = 'flac';
            buff = extractFlacMetadata(buffer);
        default:
            spectrumAvailable = false;
    }

    return {
        spectrumAvailable, 
        format,
        buff
    };
}

///////////////////////////////////////////////////

function isLittleEndian() {
    const buffer = new ArrayBuffer(4);
    const uint8Array = new Uint8Array(buffer);
    const uint32Array = new Uint32Array(buffer);

    uint32Array[0] = 0x12345678;

    if(uint8Array[0] === 0x78) {
        return true; // Little endian
    }
    return false; // Big endian
}

ylabels = [-24.0];
for (let i = -23.5; i < 0; i += 0.6) {
    ylabels.push(i);
}

const numberOfDataPoints = frequencyBand.length; // 24; // or use your data array length
const pixelPerDataPoint = 256; // Adjust based on how much space you want for each data point

// Set the width of the canvas
const totalWidth = numberOfDataPoints * pixelPerDataPoint;
myChart.canvas.style.width = totalWidth + 'px';
myChart.update();

/**
@brief Compute the endianness of the operating system.
@details Compute the endianness of the operating system.
@returns (bool) */
function verifyPlatformIsLittleEndian() {
    let buffer = new ArrayBuffer(4);
    view = new DataView(buffer);
    view.setUint32(0, 1);
    if (buffer[0] === 1) {
        return true; /* 'little-endian' */;
    }
    else if (buffer[0] === 0) {
        return false; /* 'big-endian' */;
    } else throw new Error( "Unknown endianness.");
}

/**
@brief Compute the endianness of the operating system.
@details Compute the endianness of the operating system. */
function issLittleEndian() {
    let buffer = new ArrayBuffer(2);
    let uint8Array = new Uint8Array(buffer);
    let uint16array = new Uint16Array(buffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if (uint16array[0] === 0xBBAA) {
        return true; /* 'little-endian' */;
    }
    else if (uint16array[0] === 0xAABB) {
        return false; /* 'big-endian' */;
    } else throw new Error( "Unknown endianness.");
}

    /*
    // For API generated audio
    const osc = audioContext.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 440; // 440 Hz
    gainNode.gain.value = 0.5
    osc.connect(gainNode);
    osc.start();
    */

    /*
    // For artificially generated audio
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    gainNode.connect(audioContext.destination); //source.connect(audioContext.destination);
    source.connect(gainNode);
    source.start(0);*/

    /*
    // For MP3 audio
    const audioBufferMP3 = await fetch('audio.mp3')
        .then( response => response.arrayBuffer() );
    const audioBufferSourceNode = audioContext.createBufferSource();
    audioBufferSourceNode.buffer = await audioContext.decodeAudioData(audioBufferMP3);
    gainNode.gain.value = 0.5;
    audioBufferSourceNode.connect(gainNode);
    audioBufferSourceNode.start(0);*/

    //const audioBuffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate);

    //let channelDataLeft = audioBuffer.getChannelData(0);
    //let channelDataRight = audioBuffer.getChannelData(0);

    // Write the 'RIFF' audio content
    let nextChunk = 0;
    for (let i = 0; i < totalFrames; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            let sample = Math.max(-maxIntN, Math.min(maxIntN, buffer[channel][i])); // clamp
            writeChunk(view, pcm_wav_header + nextChunk, sample < 0 ? sample & 0x8000 : sample & 0x7FFF, littleEndianFlag);
            nextChunk += byteOffset;
        }
    }

    // Write the PCM chunk data
    let writeChunk = writeInt8;
    switch (buffer[0].bitsPerSample) {
        case 8:
            writeChunk = writeInt8;
            break;
        case 16:
            writeChunk = writeInt16;
            break;
        case 24:
            writeChunk = writeInt24;
            break;
        case 32:
            writeChunk = writeInt32;
            break;
        case 64:
            writeChunk = writeInt64;
            break;
    }

audioContext = new AudioContext();
gainNode = audioContext.createGain();
gainNode.gain.value = 1.00; //  range [0,2] step size 0.01

let quarterPeriod = new Array();
let secondQuarter = new Array();
let thirdQuarter = new Array();
let fourthQuarter = new Array();
let fullSinusoidal = new Array();
/*
const stack = new Array(); // Initialize a stack
let fullPeriod = sampleRate / frequency; // Number of samples in one cycle

let halfPeriod = fullPeriod / 2; // Number of samples in one half-cycle
let quarterPeriod = fullPeriod / 4; // Number of samples in one half-cycle
*/

/*
NOTE: The following strategy was abandoned due to the false assumption peak values and zero-crossings are always captured as output values to the Sine function.
To create perfect sinusoidals involves two steps: 

First, values are cached to a stack object until the signal's quarter-period is reached, 
where it achieves its peak value.

Second, values are removed from the stack (in L.I.F.O. order) for the second quarter of the half-cycle, 
minding the correct polarity of the values. A critical aspect of this method is that the zero-crossing 
point at the cycle's half-period should align with an integer multiple of the entire cycle length. 
This alignment is necessary because it maintains the frequency without needing to adjust it or resort to dithering methods.

To ensure the halfPeriod results in an integer value without altering the frequency, sinc interpolation is also utilized. 
This technique accurately determines the exact point of the half-period's zero-crossing 
and its corresponding value on the y-axis. Although this method is computationally expensive, 
it is favored for its precision.
* /

// Use the queued values for audio processing
let cacheFullFlag = false;
for (let i = 0; i < I; ++i) {
    // Generate a half-period of the waveform
    const time = i / sampleRate;
    const value = Math.sin(2 * Math.PI * frequency * time) * amplitude;
    if (i > 0 && !cacheFullFlag) {
        const I = quarterPeriod.length-1;
        const lastValue = quarterPeriod[I];
        if (value > lastValue) {
            quarterPeriod.push(value);
        } else {
            cacheFullFlag = true;// Generate other quarters
            const secondQuarter = quarterPeriod.slice(1).reverse();
            const thirdQuarter = quarterPeriod.slice(1).map(x => -x);
            const fourthQuarter = thirdQuarter.slice(1).reverse();

            // Full sinusoidal wave array
            fullSinusoidal = [...quarterPeriod, ...secondQuarter, ...thirdQuarter, ...fourthQuarter];
            break;
        }
    } else if (!cacheFullFlag) {
        quarterPeriod.push(0);
    } else {
        break;
    }
}

// State machine to cycle through sinusoidal wave
class SinusoidalStateMachine {
    constructor() {
        this.state = 0;
    }

    nextValue() {
        const value = fullSinusoidal[this.state];
        this.state = (this.state + 1) % fullSinusoidal.length;
        return value;
    }
}

const sinusoidalMachine = new SinusoidalStateMachine();

for (let i = 0; i < I; ++i) {
    // offset channel samples by 1 for a perceived stereo signal
    channelDataLeft[i] = sinusoidalMachine.nextValue();
    channelDataRight[i] = (i > 0) ? channelDataLeft[i-1] : 0;
}

*/

/*
    /*
    The creation of perfect sinusoidal waveforms involves two main steps: Firstly, 
    values are added to a stack until the midpoint of the waveform's cycle, where it crosses zero. 
    Then, these values are removed from the stack for the second half of the cycle, 
    minding the correct polarity of the values. A critical aspect of this method is that the zero-crossing 
    point at the cycle's half-period should align with an integer multiple of the entire cycle length. 
    This alignment is necessary because it maintains the frequency without needing to adjust it or resort to dithering, 
    or similar methods.

    To ensure halfPeriod results in an integer value without altering the frequency, sinc interpolation is utilized. 
    This technique accurately determines the exact point of the half-period's zero-crossing 
    and its corresponding value on the y-axis. Although this method is computationally expensive, 
    it is favored for its precision.
    * /

    // Use the queued values for audio processing
    for (let i = 0; i < I; ++i) {
        // Generate a half-period of the waveform
        const time = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * time) * amplitude;
        if (i < halfPeriod) {
            stack.push(value);
        } else if (i === halfPeriod) {
            // Determine the exact zero-crossing point
            //const zeroCrossing = sinc_interpolation([i - 1, i], [stack[i - 1], value], halfPeriod, frequency);
            const zeroCrossing = sinc_interpolation(stack, [stack[0], value], halfPeriod, frequency);
            stack.push(zeroCrossing);
        }

        const idx = i % fullPeriod;
        if (idx < halfPeriod) {
            // Process and apply to channels
            channelDataLeft[i] = stack[idx];
        } else {
            const reverseIndex =  fullPeriod - idx + 1;
            channelDataLeft[i] = -stack[reverseIndex]; // Reverse with polarity change
        }
        channelDataRight[i] = (i > 0) ? channelDataLeft[i-1] : 0; 
    }

    */

function writeInt64(view, offset, value, isLittleEndian) {
    if (isLittleEndian) {
        view.setInt32(offset, (value >> 32) & 0xFFFFFFFF, true);
        view.setInt32(offset + 4, (value) & 0xFFFFFFFF, true);
    } else {
        view.setInt32(offset, (value) & 0xFFFFFFFF, false);
        view.setInt32(offset + 4, (value >> 32) & 0xFFFFFFFF, false);
    }
    return offset + 8;
}

    // Generate one cycle of the waveform
    for (let i = 0; i < halfPeriod; ++i) {
        const time = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * time) * amplitude;
        stack.push(value);
    }

class Stack extends Array {
    constructor() {
        super(); // Calls the Array constructor
        this._idx = 0; // Index of the top element in the stack
        this.items = []; // Array to store queue elements

        /** 
        // Example usage
        const queue = new Queue();
        queue.queue(1); // Adding element to the queue
        queue.queue(2);
        console.log(queue.dequeue()); // Removes 1 from the queue
        console.log(queue.front()); // Returns 2, the current front of the queue
        console.log(queue.size()); // Returns the size of the queue
        console.log(queue.printQueue()); // Prints all elements in the queue */
    }

    // Method to add an element to the queue
    queue(element) {
        this.items.push(element);
    }

    // Method to remove and return the element at the front of the queue
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    // Helper method to check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Helper method to view the front element of the queue
    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    // Helper method to return the size of the queue
    size() {
        return this.items.length;
    }

    // Helper method to print all elements in the queue
    printQueue() {
        let str = "";
        for (let i = 0; i < this.items.length; i++) {
            str += this.items[i] + " ";
        }
        return str.trim();
    }
}

class Queue {
    constructor() {
        this.items = []; // Array to store queue elements
    }

    // Method to add an element to the queue
    queue(element) {
        this.items.push(element);
    }

    // Method to remove and return the element at the front of the queue
    dequeue() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    // Helper method to check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Helper method to view the front element of the queue
    front() {
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    // Helper method to return the size of the queue
    size() {
        return this.items.length;
    }

    // Helper method to print all elements in the queue
    printQueue() {
        let str = "";
        for (let i = 0; i < this.items.length; i++) {
            str += this.items[i] + " ";
        }
        return str.trim();
    }
}

// Example usage
const queue = new Queue();
queue.queue(1); // Adding element to the queue
queue.queue(2);
console.log(queue.dequeue()); // Removes 1 from the queue
console.log(queue.front()); // Returns 2, the current front of the queue
console.log(queue.size()); // Returns the size of the queue
console.log(queue.printQueue()); // Prints all elements in the queue


const valueNormalizationFactor = 2 ** (bitsPerSample - 1) - 1; // Scale for 24-bit audio

let writeChunk = writeFloat8;
switch (buffer[0].bitsPerSample) {
    case 8:
        writeChunk = writeFloat8;
        break;
    case 16:
        writeChunk = writeFloat16;
        break;
    case 24:
        writeChunk = writeFloat24;
        break;
    case 32:
        writeChunk = writeFloat32;
        break;
    case 64:
        writeChunk = writeFloat64;
        break;
}

view.setInt24 = setInt24;
view.setInt64 = setInt64;

function writeInt24(view, offset, value) {
    view.setInt8(offset, value & 0xFF);
    view.setInt16(offset + 1, value, value);
    return offset + 3;
}

// Writing the 'RIFF' chunk descriptor
current_byte_offset = writeUint8(view, current_byte_offset, 0x52, littleEndianFlag);
current_byte_offset = writeUint8(view, current_byte_offset, 0x49, littleEndianFlag);
current_byte_offset = writeUint8(view, current_byte_offset, 0x46, littleEndianFlag);
current_byte_offset = writeUint8(view, current_byte_offset, 0x46, littleEndianFlag);

function writeString(view, offset, string) {
    // Encode the string as UTF-8
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(string);

    // Write each byte of the encoded string to the DataView
    for (let i = 0; i < encoded.length; ++i) {
        view.setUint8(offset + i, encoded[i]);
    }

    // Return the new offset, adjusted for the length of the encoded string
    return offset + encoded.length;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; ++i) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
    return offset + string.length;
}

switch (buffer[0].bitsPerSample) {
    case 24:
        byteOffset = 3; // 24-bit data, 3 bytes
        break;
    case 32:
        byteOffset = 4; // 32-bit data, 4 bytes
        break;
    case 64:
        byteOffset = 8; // 64-bit data, 8 bytes
        break;
    }

/*
function setInt32(view, offset, value) {
    this.setUint8(offset, (value & 0xFF0000) >> 16);
    this.setUint16(offset + 1, value & 0x00FFFF);
}
*/

            /* 
            Each sample may have multiple formants, 
            so only advance the sample when the 
            advanceSample_flag is set to true.*/
            if (shape_oscillatorParams.advanceSample_flag ) {
                audioFrames_float64Vec.push_back(outShape);
            }

/**
 * Object Mapping for Button Identifiers.
 * 
 * This mapping links the waveform or noise type options to their corresponding
 * button elements. Each key represents the text value of an option from an HTML
 * select element, and the corresponding value is the identifier for the button
 * element that should be activated for that option.
 * 
 * Usage: 
 * The `buttonMappings` object is used in the `updateMotifBar` function to 
 * determine which button should be made active based on the user's selection.
 * 
 * Structure:
 * - Key: String - The name of the waveform or noise type.
 * - Value: Object - The button element identifier associated with that type.
 *
 * Example:
 * To add a new mapping, simply add a new key-value pair to this object.
 * For instance, if you have a new type 'XYZ', and the corresponding button
 * identifier is 'XYZBTN', add it as:
 * 'XYZ': XYZBTN
 *
 * Note:
 * Ensure that the keys in this object exactly match the option values in the
 * HTML select element and that the button identifiers are correctly defined
 * in the HTML or JavaScript.
 */

        /*
        showConfirmBox({ message: "Would you like to re-sample the audio?" })
        .then(res => {
            res;

            // TODO: Re-sample the audio (scale the frame property of each OSC_INTERVAL object by the new overall length)

            const nextOSCINterval_frame = lastOSCInterval.frame + dx;
            const nextOSCInterval_time_step = lastOSCInterval.time_step;
            formant.push(new OSC_INTERVAL({ amplitude: lastOSCInterval.amplitude
                , frequency: lastOSCInterval.frequency
                , frame: nextOSCINterval_frame
                , time_step: nextOSCInterval_time_step }) );
            updateChart(formant);
        })
        .catch(err => {
            err;
            const nextOSCINterval_frame = lastOSCInterval.frame + dx;
            const nextOSCInterval_time_step = lastOSCInterval.time_step;
            formant.push(new OSC_INTERVAL({ amplitude: lastOSCInterval.amplitude
                , frequency: lastOSCInterval.frequency
                , frame: nextOSCINterval_frame
                , time_step: nextOSCInterval_time_step }) );
            updateChart(formant);
        });
        */

        /*
        showConfirmBox({ message: "Would you like to re-sample the audio?" })
        .then(res => {
            res;
            // TODO: Reverse iterate through the OSC_INTERVAL objects and their frames, until the frame deltas all sum to == dx;
            //  copy the rmaining OSC_INTERVAL objects, and then replace the original objects with the new one.
            // TODO: Re-sample the audio (scale the frame property of each OSC_INTERVAL object by the new overall length)
            
            const nextOSCINterval_frame = lastOSCInterval.frame - dx;
            const nextOSCInterval_time_step = lastOSCInterval.time_step;
            formant.push(new OSC_INTERVAL({ amplitude: lastOSCInterval.amplitude
                , frequency: lastOSCInterval.frequency
                , frame: nextOSCINterval_frame
                , time_step: nextOSCInterval_time_step }) );
            updateChart(formant);
        })
        .catch(err => {
            err;
            
            const nextOSCINterval_frame = lastOSCInterval.frame - dx;
            const nextOSCInterval_time_step = lastOSCInterval.time_step;
            formant.push(new OSC_INTERVAL({ amplitude: lastOSCInterval.amplitude
                , frequency: lastOSCInterval.frequency
                , frame: nextOSCINterval_frame
                , time_step: nextOSCInterval_time_step }) );
            updateChart(formant);
            
        });
        */

if (chart.yAxisAmplitudeVisibleFlag){
    ctx.fillText(`${yValue.toFixed(2)} dBFS`, 19, y);
    // Draw a point at the amplitude intersection
    const amplitudeXPixel = chart.scales['x-axis-frame'].getPixelForValue(xValue);
    const amplitudeYPixel = chart.scales['y-axis-amplitude'].getPixelForValue(yValue);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a 5px radius point
    ctx.fillStyle = 'rgba(0,0,255,0.7)';
    ctx.fill();
} else {
    ctx.fillText(`${yValue.toFixed(2)} Hz`, rightX + 10, y);
    // Draw a point at the frequency intersection
    const amplitudeXPixel = chart.scales['x-axis-frame'].getPixelForValue(xValue);
    const amplitudeYPixel = chart.scales['y-axis-frequency'].getPixelForValue(yValue);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a 5px radius point
    ctx.fillStyle = 'rgba(0,255,0,0.7)';
    ctx.fill();
}

            // Text alignment and position adjustments as needed
            ctx.fillText(`Frame #${xValue.toFixed(0)}`, x - 50, 64); // top-most x-axis
            ctx.fillText(`Frame #${xValue.toFixed(0)}`, x - 50, bottomY + 18); // bottom-most x-axis

const yAxisAmplitude = chart.scales['y-axis-amplitude'];
const yAxisAmplitudeVisibleFlag = (yAxisAmplitude && yAxisAmplitude.options.display);

            //const leftXDupl = chart.scales['x-axis-frame-dupl'].left;
            //const rightXDupl = chart.scales['x-axis-frame-dupl'].right;
            //const xValueDupl = chart.scales['x-axis-frame-dupl'].getValueForPixel(x);

function updateCrossHair(e) {
    let rect = document.getElementById('formant-graph').getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    /*
    // cache the previous mouse coordinates
    if (g_formantChart.crosshair) {
        g_formantChart.old_crosshair.x = g_formantChart.crosshair.x;
        g_formantChart.old_crosshair.y = g_formantChart.crosshair.y;
    }
    */
    // Store the mouse position in a variable accessible by the Chart.js plugin
    g_formantChart.crosshair = { x: mouseX, y: mouseY };

    //g_formantChart.update();

    //crossHairPlugin.afterDatasetsDraw(g_formantChart);

    g_formantChart.update();

    //requestAnimationFrame(updateCrossHair);
}

const crossHairPlugin = {
    id: "crossHairPlugin",
    afterDatasetsDraw: function(chart, args, opts) {
        if (chart.crosshair) {
        //if (chart.tooltip._active && chart.tooltip._active.length) {
            let ctx = chart.ctx;
            let x = chart.crosshair.x; //chart.tooltip._active[0].element.x;
            let y = chart.crosshair.y; //chart.tooltip._active[0].element.y;
            const topY = chart.scales['y-axis-amplitude'].top;
            const bottomY = chart.scales['y-axis-amplitude'].bottom;
            const leftX = chart.scales['x-axis-frame'].top;
            const rightX = chart.scales['x-axis-frame'].bottom;

            ctx.save();
            ctx.beginPath();

            // Draw new vertical line
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(140,140,140,0.5)';
            ctx.stroke();

            ctx.restore();

            chart.old_crosshair = chart.crosshair;
            chart.old_crosshair.topY = topY;
            chart.old_crosshair.bottomY = bottomY;
        }
    },
};

const crossHairPlugin = {
    id: "crossHairPlugin",
    afterDatasetsDraw: function(chart, args, opts) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            let ctx = chart.ctx;
            let x = chart.tooltip._active[0].element.x;
            let y = chart.tooltip._active[0].element.y;
            const topY = chart.scales['y-axis-amplitude'].top;
            const bottomY = chart.scales['y-axis-amplitude'].bottom;
            const leftX = chart.scales['x-axis-frame'].top;
            const rightX = chart.scales['x-axis-frame'].bottom;

            ctx.save();
            ctx.beginPath();

            // Draw vertical line
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(140,140,140,0.5)';
            ctx.stroke();

            // Draw horizontal line
            ctx.moveTo(x, leftX);
            ctx.lineTo(x, rightX);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(140,140,140,0.5)';
            ctx.stroke();

            ctx.restore();
        }
    },
};

// Extracting time_steps, amplitudes, and frequencies
const g_time_steps = Formants[0].map(osc_interval => osc_interval.time_step);
const g_amplitudes = Formants[0].map(osc_interval => osc_interval.amplitude);
const g_frequencies = Formants[0].map(osc_interval => osc_interval.frequency);
const g_frames = Formants[0].map(osc_interval => osc_interval.frame);

data: {
    /*labels: g_frames,*/
    datasets: [{
        label: 'Amplitude (dBFS)',
        data: Formants[0].map(osc_interval => ({y:osc_interval.amplitude, x:osc_interval.frame})),
        borderColor: 'blue',
        backgroundColor: 'rgb(0, 0, 255)',
        yAxisID: 'y-axis-amplitude',
        xAxisID: 'x-axis-frame',
    }, {
        label: 'Frequency (Hz)',
        data: Formants[0].map(osc_interval => ({y:osc_interval.frequency, x:osc_interval.frame})),
        borderColor: 'green',
        backgroundColor: 'rgb(0, 140, 0)',
        yAxisID: 'y-axis-frequency',
        xAxisID: 'x-axis-frame-dupl',
    }]
},

// reafactor pcm_encoding_docstring_options to include resolution and sample_rate
for (const [key, value] of Object.entries(pcm_encoding_docstring_options)) {
    if (typeof value === 'string') {
        // Extract resolution and sample rate from the string
        const [resolution, sampleRate] = value.match(/\d+.?\d*/)[0].split(/\//);
        const pcmString = `PCM ${resolution}/${sampleRate}`;

        // Update the dictionary entry
        pcm_encoding_docstring_options[key] = {
            pcm_string: pcmString,
            resolution: resolution,
            sample_rate: sampleRate
        };
    }
}

confirmYes.addEventListener("click", function() {
    showHideConfirmBox();
});

confirmNo.addEventListener("click", function() {
    showHideConfirmBox();
});

addFramesBTN.addEventListener('click', function() {
    var formant = Formants[g_lastSelectedFormantIndex];
    const I = audioFrame_sizes[a_frames_selector.selectedIndex];
    const lastOSCInterval = formant[formant.length - 1];
    const lastFrame = lastOSCInterval.frame;
    const lastTimestep = lastOSCInterval.time_step;
    for (var i = 0; i < I; i++) {
        formant.push( new OSC_INTERVAL ({ amplitude: -6.0
            , frequency: 50.0
            , frame: lastFrame + i + 1
            , time_step: lastTimestep }) );
    }
});

/*
// Combine your data into a single array
const combinedData = Formants[0].map(osc_interval => ({
    frame: osc_interval.frame,
    timeStep: osc_interval.time_step,
    amplitude: osc_interval.amplitude,
    frequency: osc_interval.frequency
}));
*/

/*
function getFormantData(formant) {
    const time_steps = formant.map(osc_interval => osc_interval.time_step);
    const amplitudes = formant.map(osc_interval => osc_interval.amplitude);
    const frequencies = formant.map(osc_interval => osc_interval.frequency);
    const frames = formant.map(osc_interval => osc_interval.frame);
    return { time_steps, amplitudes, frequencies, frames };
}
*/

settings_button.addEventListener("click", function() {
    settingsBox.style.display = "block";
});

g_config = {
    type: 'line',
    data: {
        /*labels: g_frames,*/
        datasets: [{
            label: 'Amplitude (dB)',
            data: Formants[0].map(osc_interval => ({y:osc_interval.amplitude, x:osc_interval.frame})),
            borderColor: 'blue',
            backgroundColor: 'rgb(0, 0, 255)',
            yAxisID: 'y-axis-amplitude',
            xAxisID: 'x-axis-frame',
        }, {
            label: 'Frequency (Hz)',
            data: Formants[0].map(osc_interval => ({y:osc_interval.frequency, x:osc_interval.frame})),
            borderColor: 'green',
            backgroundColor: 'rgb(0, 140, 0)',
            yAxisID: 'y-axis-frequency',
            xAxisID: 'x-axis-frame',
        }]
    },
    options: {
        scales: {
            'y-axis-amplitude': {
                type: 'linear',
                title: { 
                    text: 'dB',
                    display: true,
                },
                display: true,
                position: 'left',
                grid: {
                    drawOnChartArea: true
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                          // call the default formatter, forwarding `this`
                          return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]) + ' dB';
                    }
                }
            },
            'y-axis-frequency': {
                type: 'linear',
                title: { 
                    text: 'Hz',
                    display: true,
                },
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        // call the default formatter, forwarding `this`
                        return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]) + ' Hz';
                    }
                }
            },
            'x-axis-frame': {
                type: 'linear',
                title: { 
                    text: 'Audio ( Frame ) ',
                    display: true,
                },
                display: true,
                position: 'bottom',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        // call the default formatter, forwarding `this`
                        return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    fontSize: 14 // Legend font size
                }
            },
            tooltip: {
                // Enable custom tooltips
                enabled: true,
                mode: 'index',
                position: 'nearest',
                bodyFontSize: 12, // Tooltip font size
                callbacks: {
                    title: function(tooltips, data) {
                        // Assuming the first dataset is for amplitude and has complete frame and time_step data
                        //const tt = tooltips[0];
                        const tt2 = tooltips[1];
                        //const tmpTimeStep = tt.label;
                        const tmpFrame = tt2.label;
                        /*
                        const tmpAmplitude = tt.formattedValue;
                        const tmpfrequency = tt2.formattedValue;
                        */
                        return `Frame: ${tmpFrame}`;
                    },
                    label: function(tooltipItem, data) {
                        // tooltipItem is an object containing properties of the tooltip
                        // data is an object containing all data passed to the chart
                        let yLabel = tooltipItem.formattedValue;
                        const xLabel = tooltipItem.dataset.label;
                        if (xLabel.match(/^Amplitude/)) {
                            yLabel = `Amplitude: ${yLabel} dB`;
                        } else if (xLabel.match(/^Frequency/)) {
                            yLabel = `Frequency: ${yLabel} Hz`;
                        }
                        return yLabel;
                    },
                }
            },
        },
    }
};

tooltip: {
    // Enable custom tooltips
    enabled: true,
    mode: 'index',
    position: 'nearest',
    bodyFontSize: 12, // Tooltip font size
    callbacks: {
        title: function(tooltips, data) {
            // Assuming the first dataset is for amplitude and has complete frame and time_step data
            /*
            tooltips.map(tt => {
                return tt;
            });*/
            const tt = tooltips[0];
            const tt2 = tooltips[1];
            const tmpTimeStep = tt.label;
            const tmpFrame = tt2.label;
            /*
            const tmpAmplitude = tt.formattedValue;
            const tmpfrequency = tt2.formattedValue;
            */
            return `Frame: ${tmpFrame}\nTimestep: ${tmpTimeStep} ms`;
        },
        label: function(tooltipItem, data) {
            // tooltipItem is an object containing properties of the tooltip
            // data is an object containing all data passed to the chart
            let yLabel = tooltipItem.formattedValue;
            if (tooltipItem.dataset.label == 'Amplitude (dB)') {
                yLabel = 'Amplitude: ' + yLabel + ' dB';
            } else if (tooltipItem.dataset.label == 'Frequency (Hz)') {
                yLabel = 'Frequency: ' + yLabel + ' Hz';
            }
            return yLabel;
        }
    }
},

'x-axis-frame': {
    type: 'linear',
    title: { 
        text: 'Audio ( Frame ) ',
        display: true,
    },
    display: true,
    position: 'bottom',
    grid: {
        drawOnChartArea: false
    },
    ticks: {
        min: 0, // Set the minimum value
        max: 2050, // Set the maximum value (adjust according to your data)
        stepSize: 292, // Set the stepSize
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            // call the default formatter, forwarding `this`
            return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
        }
    }
},
'x-axis-timestep': {
    type: 'linear',
    title: { 
        text: 'Timestep ( milliseconds ) ',
        display: true,
    },
    display: true,
    position: 'top',
    grid: {
        drawOnChartArea: false
    },
    ticks: {
        min: 0, // Set the minimum value
        max: 105, // Set the maximum value (adjust according to your data)
        stepSize: 15, // Set the stepSize
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            // call the default formatter, forwarding `this`
            return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
        }
    }
},

'x-axis-frames': {
    type: 'linear',
    title: { 
        text: 'Audio ( Frame ) ',
        display: true,
    },
    display: true,
    position: 'bottom',
    scaleLabel:{
        display: true,
        labelString: 'Audio ( Frame )'
    },
    grid: {
        drawOnChartArea: false
    },
    ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            // call the default formatter, forwarding `this`
            return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
        }
    }
},
'x-axis-timestep': {
    type: 'linear',
    title: { 
        text: 'Timestep ( milliseconds ) ',
        display: true,
    },
    display: true,
    position: 'top',
    scaleLabel:{
        display: true,
        labelString: 'Audio ( Frame )'
    },
    grid: {
        drawOnChartArea: false
    },
    ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, ticks) {
            // call the default formatter, forwarding `this`
            return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]);
        }
    }
},

Q:Is there any way to simplify this .js pseudo-code call stack,
```
after selecting an option in formant_selector
    const formant_selector.selectedIndex << the current option's value is cached to 
    an onchange handler is then called
        const current_formant_count = this.options.length;
        const selectedOptionClassList = formant_selector.options[formant_selector.selectedIndex].classList;
        const selectedIndex = formant_selector.selectedIndex;
        if selectedOptionClassList.contains('insert_formant_class')
            insertNewFormant(g_lastSelectedFormantIndex);
                const formant = Formant[g_lastSelectedFormantIndex];
                var tmpFormant = new FORMANTS({ motif: formant.motif });
                formant.map(osc_interval => { 
                    tmpFormant.push(new OSC_INTERVAL({ amplitude: osc_interval.amplitude
                        , frequency: osc_interval.frequency
                        , frame: osc_interval.frame
                        , time_step: osc_interval.time_step }) );
                    return osc_interval;
                });
                g_lastSelectedFormantIndex = Formant.push(tmpFormant) - 1;
                updateFormantSelectElement(i);
                updateMotifBar(tmpFormant.motif);
                updateChart(tmpFormant);
                    config.data.labels = formant.map(osc_interval => osc_interval.frame);
                    config.data.datasets[0].data = formant.map(osc_interval => osc_interval.amplitude);
                    config.data.datasets[1].data = formant.map(osc_interval => osc_interval.frequency);
                    g_formantChart = new Chart(ctx, config);
        else if selectedOptionClassList.contains('remove_current_formant_class') && current_formant_count > minimum_allowed_select_element_count
            removeFormantAt(g_lastSelectedFormantIndex);
                Formants.splice(i-1, 1);
                g_lastSelectedFormantIndex = i = (i - 1 > -1) ? --i : 0;
                updateFormantSelectElement(i);
                const formant = Formants[i];
                updateMotifBar(formant.motif);
                updateChart(formant);
                    config.data.labels = formant.map(osc_interval => osc_interval.frame);
                    config.data.datasets[0].data = formant.map(osc_interval => osc_interval.amplitude);
                    config.data.datasets[1].data = formant.map(osc_interval => osc_interval.frequency);
                    g_formantChart = new Chart(ctx, config);
        else
            g_lastSelectedFormantIndex = selectedIndex;
            const formant = Formant[g_lastSelectedFormantIndex];
            updateChart(formant);
                config.data.labels = formant.map(osc_interval => osc_interval.frame);
                config.data.datasets[0].data = formant.map(osc_interval => osc_interval.amplitude);
                config.data.datasets[1].data = formant.map(osc_interval => osc_interval.frequency);
                g_formantChart = new Chart(ctx, config);
``` ?


    /*
    let formantSelectElement = document.getElementById('formant-select');
    let formantSelectElementOptions = formantSelectElement.options;
    let formantSelectElementOptionsLength = formantSelectElementOptions.length;
    let formantSelectElementOptionsLastIndex = formantSelectElementOptionsLength - 1;
    let lastOption = formantSelectElementOptions[formantSelectElementOptionsLastIndex];
    let lastOptionText = lastOption.text;
    let lastOptionValue = lastOption.value;
    let lastOptionClass = lastOption.classList;

    if (lastOptionText == 'Insert Formant') {
        formantSelectElement.remove(formantSelectElementOptionsLastIndex);
    } else {
        formantSelectElementOptions[formantSelectElementOptionsLastIndex].text = 'Insert Formant';
        formantSelectElementOptions[formantSelectElementOptionsLastIndex].value = 'insert_formant';
        formantSelectElementOptions[formantSelectElementOptionsLastIndex].classList.add('insert_formant_class');
    }
    */
   
// out
okBTN.addEventListener('click', function(e) {
    e.preventDefault();
    let json = JSON.stringify(2, ' ', g_formantChart.data)
    JsonTA.value = json;
    OutJsonBTN.click();
});

cancelBTN.addEventListener('click', function(e) {
    OutJsonBTN.click();
});

plugins: {/*
    title: {
        display: true,
        text: 'F0 Formant Editor',
        fontSize: 20 // Title font size
    },
    subtitle: {
        display: true,
        text: 'Custom Formant Editor'
    },*/
    legend: {
        labels: {
            fontSize: 14 // Legend font size
        }
    },
}

const rotateYAxisTitle_Plugin = {
  beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales['y-axis-amplitude']; // Adjust for your specific y-axis ID
      const text = "Amplitude (dB)"; // Your y-axis title here
      const x = yAxis.left / 2; // X position
      const y = (chart.height + chart.chartArea.top) / 2; // Y position
      const rotation = -90 * Math.PI / 180; // Rotation angle in radians (-90 degrees)
  
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.textAlign = "center";
      ctx.fillText(text, 0, 0);
      ctx.restore();
  }
};

const rotateYAxisTitle_Plugin = {
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const yAxis = chart.scales['y-axis-amplitude']; // Adjust for your specific y-axis ID
        const text = "Amplitude (dB)"; // Your y-axis title here
        const x = yAxis.left / 2; // X position
        const y = (chart.height + chart.chartArea.top) / 2; // Y position
        const rotation = -90 * Math.PI / 180; // Rotation angle in radians (-90 degrees)
    
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.textAlign = "center";
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
};

// rotateYAxisTitle_Plugin
callbacks:{
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        //const yAxis = chart.scales['y-axis-amplitude']; // Adjust for your specific y-axis ID
        //const text = "Your Y-Axis Title"; // Your y-axis title here
        //const x = yAxis.left / 2; // X position
        //const y = (chart.height + chart.chartArea.top) / 2; // Y position
        const rotation = -90 * Math.PI / 180; // Rotation angle in radians (-90 degrees)
    
        ctx.save();
        //ctx.translate(x, y);
        ctx.rotate(rotation);
        //ctx.textAlign = "center";
        //ctx.fillText(text, 0, 0);
        ctx.restore();
        //ctx.update();
    }},

// Event listeners for dropdowns
document.getElementById('frequency-selector').addEventListener('change', function() {
    // Update chart data
  });
  
  // Event listeners for dropdowns
  document.getElementById('amplitude-selector').addEventListener('change', function() {
    // Update chart data
  });
  
  // Event listeners for dropdowns
  document.getElementById('motif-selector').addEventListener('change', function() {
    // Update chart data
  });
  
  // Event listeners for dropdowns
  document.getElementById('samples-selector').addEventListener('change', function() {
    // Update chart data
  });

document.querySelector('select[id="amplitude-selector"]').value = '0';
document.querySelector('select[id="frequency-selector"]').value = '1';
document.querySelector('select[id="motif-selector"]').value = '3';
document.querySelector('select[id="samples-selector"]').value = '2';
