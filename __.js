try {

/**
 Compatibility:
    // Lossless
    - .WAV
    - .FLAC
    // Lossy
    - .MP3
    - .AAC
*/

// globals //
peakAmplitudes = {}; 
currentFrequencyBand = {};

// DOM elements
const step = 12;
const soundFloor = 0.01; // Minimum amplitude to be considered as sound
const totalValues = 20480; // Or any other end value you need
const valuesPerOption = 160; // Number of values in each range
const negativeDynamicThreshold = -100; // dBFS

// Clear existing options
band_selector.innerHTML = '';

// Build options
g_globalFrequencyBand = [];

function buildOptionsElement() {
    // Define the start value and the number of steps
    let startValue = 0;
    for (let value = startValue; value <= totalValues; value += valuesPerOption * step) {
        // Calculate end value for the current range
        let endValue = value + valuesPerOption * step - step;

        // Ensure endValue does not exceed totalValues
        if (endValue > totalValues) {
            endValue = totalValues;
        }

        // Create the option element
        const option = document.createElement('option');
        g_globalFrequencyBand.push({ start: value, end: endValue });
        option.textContent = `${value} Hz to ${endValue} Hz`;

        // Append the option to the select element
        band_selector.appendChild(option);

        // Prepare the next startValue
        startValue = endValue + step;
    }
}


buildOptionsElement();

audioPlayer.addEventListener('onclick', function() {

    // Change volume (0.0 to 1.0)
    audioPlayer.volume = 0.5;

    // Play audio
    // Toggle play/pause based on audioPlayer.paused
    // Update the audioPlayer.paused flag
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        //audioPlayer.paused = false;
    } else {
        audioPlayer.play();
        //audioPlayer.paused = false;
        // Start or resume the audio context on user interaction, if necessary
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

});

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function normalizeAmplitude(amplitude, dynamicRange) {
    return (dynamicRange-amplitude) / dynamicRange;
}

const decayRate = 0.005; // Adjust as necessary for your desired decay speed

function updatePeak(peak, dbFS, dynamicRange) {
    if (dbFS > peak.amplitude_rdBFS) {
        peak.amplitude_rdBFS = dbFS;
    } else {
        peak.amplitude_rdBFS -= decayRate;
    }
}

function populateCurrentFrequencyBandAmplitudes(currentFrequencyBandAmplitudes) {
    for (const fband of currentFrequencyBand.LChannel) {
        currentFrequencyBandAmplitudes.push({ x: fband.frequency_hz, y: fband.amplitude_rdBFS });
    }
}

function swapOutFrequencyBands(targetFrequency, targetFrequencyEnd) {
    peakAmplitudes.LChannel = [];
    peakAmplitudes.RChannel = [];
    currentFrequencyBand.LChannel = [];
    currentFrequencyBand.RChannel = [];
    for (let band = targetFrequency; band <= targetFrequencyEnd; band += step) {
        peakAmplitudes.LChannel.push( new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }) );
        peakAmplitudes.RChannel.push( new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }) );
        currentFrequencyBand.LChannel.push( new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }) );
        currentFrequencyBand.RChannel.push( new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }) );
    }
}

function outOfBandFrequencyPairing(targetFrequency, currentFrequency) {
    return (targetFrequency != currentFrequency);
}

// REM: Bitrate = Sample Rate * Bit Depth * Number of Channels
// REM: Sample Rate = Bitrate / (Bit Depth * Number of Channels)

const supportedBitDepthEncodings = [8, 16, 24, 32];

g_bitDepth = supportedBitDepthEncodings[3]; // default 32-bit floating point audio

audioContext = new (window.AudioContext || window.webkitAudioContext)();

LChannelAnalyzer = audioContext.createAnalyser();
RChannelAnalyzer = audioContext.createAnalyser();

LChannelAnalyzer.connect(audioContext.destination);
RChannelAnalyzer.connect(audioContext.destination);

source = audioContext.createMediaElementSource(audioPlayer);

source.connect(LChannelAnalyzer);
source.connect(RChannelAnalyzer);

// Set up the analyzer
LChannelAnalyzer.fftSize = 2048; // default (Should be a power of 2)
RChannelAnalyzer.fftSize = 2048; // default (Should be a power of 2)

function updateSpectrum() {
    requestAnimationFrame(updateSpectrum);
    const audioBuffer = audioContext.audioBufferFloat32Array;

    // Assuming audioBuffer is your AudioBuffer object
    const numberOfChannels = audioBuffer.numberOfChannels;
    // The sample rate of the audio track
    const sampleRate = audioBuffer.sampleRate; // This should be set to your actual audio track's sample rate
    const dynamicRange = audioBuffer.dynamicRange; // This should be set to your actual audio track's dynamic range
    // Desired bandwidth per frequency bin
    const desiredBandwidthPerBin = step; // 4Hz

    // Calculate initial fftSize to achieve the desired bandwidth
    // Define minimum and maximum fftSize constraints
    const minFFT_CutOff = 32; // Minimum fftSize
    const maxFFT_CutOff = 32768; // Maximum fftSize 

    // Note: valuesPerOption(20480)/valuesPerOption(160) == (ie. FrequencyBinCount(8192)) = fftSize / 2
    //sampleRate * valuesPerOption / totalValues;//totalValues / valuesPerOption * 2; // valuesPerOption(160) // desiredBandwidthPerBin(4)
    let fftSize = sampleRate / desiredBandwidthPerBin;

    // Find the nearest power of 2 greater than or equal to calculated fftSize
    let mantissa = Math.ceil(Math.log(fftSize) / Math.log(2));

    fftSize = 1 << mantissa;

    // Ensure fftSize is within constraints
    fftSize = Math.max(minFFT_CutOff, Math.min(fftSize, maxFFT_CutOff)); // 1 << 9; // 1 << 10; // 1 << 13;

    // Set the fftSize for the analyzer
    // Now, analyzer.fftSize is set to a value that provides a 4Hz bandwidth per each frequency bin,
    // while also being a power of 2 and within the specified constraints.
    LChannelAnalyzer.fftSize = fftSize;
    RChannelAnalyzer.fftSize = fftSize;

    let LChannelDataArray = new Float32Array(LChannelAnalyzer.frequencyBinCount);
    let RChannelDataArray = new Float32Array(RChannelAnalyzer.frequencyBinCount);

    LChannelAnalyzer.getFloatFrequencyData(LChannelDataArray); // write in-place to LChannelDataArray
    RChannelAnalyzer.getFloatFrequencyData(RChannelDataArray); // write in-place to RChannelDataArray

    // Extract the value from the option element's index
    const selectedIndex = band_selector.selectedIndex;

    const { start, end } = g_globalFrequencyBand[selectedIndex];

    if (outOfBandFrequencyPairing(start, currentFrequencyBand.LChannel[0].frequency_hz)) {
        swapOutFrequencyBands(start, end);
    }

    // Update the peak amplitudes and current frequency bands for LHS channel
    if (numberOfChannels > 0) {
        const channel = 0;
        let idx = 0;
        let currentBand = start;
        let updatedFrequencyBands = [];
        for (let band of currentFrequencyBand.LChannel) {
            const value = LChannelDataArray[currentBand];
            const clampedValue = clamp(value, negativeDynamicThreshold, 0); // dBFS
            const currentAmplitude = normalizeAmplitude(Math.abs(clampedValue), Math.abs(negativeDynamicThreshold));// adjusted range from 0.0 to 1.0 

            // Update the amplitude at the current band
            band.amplitude_rdBFS = currentAmplitude;

            // Update peakAmplitudes and or apply decay
            updatePeak(peakAmplitudes.LChannel[idx], currentAmplitude, dynamicRange);

            // Since you're working with 32-bit floating-point audio, your values will range from -1.0 to 1.0. //
            updatedFrequencyBands.push({ x: band.frequency_hz, y: currentAmplitude })

            ++idx;
            ++currentBand;
        }

        // Update the ChartJS chart with the new `updatedFrequencyBands` and `peakAmplitudes`
        myChart.data.datasets[channel].data = updatedFrequencyBands; // Current levels LHS/RHS
    } // end for (channel of LChannelAudio)

    // Update the peak amplitudes and current frequency bands for RHS channel
    if (numberOfChannels > 1) {
        const channel = 1;
        
        let idx = 0;
        let currentBand = start;
        let updatedFrequencyBands = [];
        for (let band of currentFrequencyBand.RChannel) {
            const value = RChannelDataArray[currentBand];
            const clampedValue = clamp(value, negativeDynamicThreshold, 0); // dBFS
            const currentAmplitude = normalizeAmplitude(Math.abs(clampedValue), Math.abs(negativeDynamicThreshold));// adjusted range from 0.0 to 1.0 

            // Update the amplitude at the current band
            band.amplitude_rdBFS = currentAmplitude;

            // Update peakAmplitudes and or apply decay
            updatePeak(peakAmplitudes.RChannel[idx], currentAmplitude, dynamicRange);

            // Since you're working with 32-bit floating-point audio, your values will range from -1.0 to 1.0. //
            updatedFrequencyBands.push({ x: band.frequency_hz, y: currentAmplitude })

            ++idx;
            ++currentBand;
        }

        // Update the ChartJS chart with the new `updatedFrequencyBands` and `peakAmplitudes`
        myChart.data.datasets[channel].data = updatedFrequencyBands; // Current levels LHS/RHS
    } // end for (channel of RChannelAudio)

    myChart.update();
}

function showAudioAttributes(audioBuffer) {
    const duration = audioBuffer.duration;
    const bitDepth = audioBuffer.bitDepth;
    const lengthInBytes = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const numberOfChannels = audioBuffer.numberOfChannels;

    audio_attributes.innerHTML = '';

    if (duration) {
        audio_attributes.appendChild(document.createElement('div')).textContent = `Duration: ${duration} seconds`;
    }

    if (numberOfChannels) {
        audio_attributes.appendChild(document.createElement('div')).textContent = `Audio Channels: ${numberOfChannels}`;
    }

    if (bitDepth) {
        audio_attributes.appendChild(document.createElement('div')).textContent = `PCM Resolution: ${bitDepth}-Bit`;
    }

    if (sampleRate) {
        audio_attributes.appendChild(document.createElement('div')).textContent = `PCM Sample Rate: ${sampleRate} Hz`;
    }

    if (lengthInBytes) {
        audio_attributes.appendChild(document.createElement('div')).textContent = `Channel Length: ${lengthInBytes} frames`;
    }
    info_window.style.display = 'inline';
}


/**
@brief Compute the endianness of the operating system.
@details Compute the endianness of the operating system. */
function isLittleEndian() {
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

// Helper functions to write strings as 8-bit integers (bytes)
function writeString(view, offset, string, littleEndianFlag) {
    for (let i = 0; i < string.length; ++i) {
        // Get the UTF-16 code unit for each character
        const codeUnit = string.charCodeAt(i);

        // Write the code unit to the DataView as a 16-bit integer
        view.setUint8(offset + i, codeUnit, littleEndianFlag); // using little-endian format
    }

    // Return the new offset, which is the initial offset plus twice the string's length
    return offset + string.length;
}

const platformEndianness = isLittleEndian();
wavHeader = new DataView(new ArrayBuffer(4), 0, 4);
flacHeader = new DataView(new ArrayBuffer(4), 0, 4);

writeString(wavHeader, 0, 'RIFF', platformEndianness); // 0x52494646 {"46464952" little-endian}
writeString(flacHeader, 0, 'fLaC', platformEndianness); // 0x664C6143 {"664C6143" little-endian}

/** 
@brief: The audioPlayer object is a reference to the audio element that is currently playing.
@details: REM:: The AudioContext object is a builtin object. Its functionality can only be invoked fom within an HTML audio control element.*/
audioPlayer.addEventListener('play', function() {
    audioPlayer.paused = false;
    
    fetch(audioPlayer.src)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            // Create DataViews for reading the audio (metatable) header
            const audioHeader = new DataView(arrayBuffer);

            const headerIntro = audioHeader.getUint32(0, platformEndianness)

            /*
            Get the bit depth for the supported audio frmats (eg. .WAV), assuming PCM encoding, 
            for appropriate (amplitude) dynamic range decoding of animations

            Note: The AudioContext actually reads all of these audio attributes 
            from the metatable file header, except bit-depth, 
            which we need to know in advance for the animation */
            if (headerIntro == wavHeader.getUint32(0, platformEndianness) // "RIFF"
                && (audioHeader.getUint8(20, platformEndianness) & 0x03) == 1) { // No Compression (ie. PCM)
                    g_bitDepth = audioHeader.getUint16(34, platformEndianness);
            } else if (headerIntro == flacHeader.getUint32(0, platformEndianness)) { // "fLaC"
                    /*
                    fLaC is designed for streaming, so its 3-bit (PCM) 
                    bit depth field is encoded in the frame header of the audio packet */
                    const HEADER_OFFSET = 8; // Offset for the HEADERINFO block
                    const SAMPLE_RATE_OFFSET = 18; // Offset for the sample rate portion in the HEADERINFO block

                    const BIT_FLAG_OFFSET = SAMPLE_RATE_OFFSET + 3; // Offset for the Bit flag (3 bits) after the sample rate

                    // Calculate the start position of the sample rate portion
                    let sampleRateStartPosition = HEADER_OFFSET + BIT_FLAG_OFFSET;

                    // If endiannessFlag indicates big-endian, swap the byte order
                    if (platformEndianness === false) { // (big-endian)
                        sampleRateStartPosition += 1; // Adjust the position to skip the first byte
                    }

                    // Read the 3-bit Bit flag from the calculated offset
                    const bitsPerSampleFlag = audioHeader.getUint8(sampleRateStartPosition, 
                        platformEndianness) & 0b00000111;

                    switch (bitsPerSampleFlag) {
                        case 0x01: // 8-bit
                            g_bitDepth = 8;
                            break;
                        case 0x02: // 12-bit
                            g_bitDepth = 12;
                            break;
                        case 0x04: // 16-bit
                            g_bitDepth = 16;
                            break;
                        case 0x05: // 20-bit
                            g_bitDepth = 20;
                            break;
                        case 0x06: // 24-bit
                            g_bitDepth = 24;
                            break;
                        case 0x03: // reserved
                        case 0x07: // 32-bit
                        default:
                            g_bitDepth = 32;
                            break;
                    }
            }

            // next step, decode audio
            return audioContext.decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {

            const durationInSeconds = audioBuffer.duration;
            const sampleRate = audioBuffer.sampleRate;
            const numberOfChannels = audioBuffer.numberOfChannels;
            const lengthInBytes = audioBuffer.lengthInBytes = audioBuffer.length;
            const dynamicRange = audioBuffer.dynamicRange = Math.pow(2, g_bitDepth) - 1;
            const bitDepth = audioBuffer.bitDepth = g_bitDepth;
            audioContext.audioBufferFloat32Array = audioBuffer;

            showAudioAttributes(audioBuffer);
            updateSpectrum();

        })
    .catch(e => console.error(e));

});

audioPlayer.addEventListener('pause', function() {
    audioPlayer.paused = true;
});

let dropZone = document.getElementById('drop_zone');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('highlight');
}

function unhighlight(e) {
    dropZone.classList.remove('highlight');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;

    let files = dt.files;

    info_window.style.display = 'none';
    handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
    let url = URL.createObjectURL(file);
    audioPlayer.src = url;
    triggerSuccessAnimation();
    file_url.textContent = `${file.name} [ ${file.size} bytes ] -- [ ${url}/${file.name} ]`;
}

function triggerSuccessAnimation() {
    let originalText = document.getElementById('original_text');
    let successMessage = document.getElementById('success_message');
  
    // Hide original text and show success message
    originalText.style.visibility = 'hidden';
    successMessage.style.display = 'block';
    successMessage.style.animation = 'successAnimation 2s forwards';
  
    // After animation, show original text and hide success message
    setTimeout(() => {
      successMessage.style.display = 'none';
      originalText.style.visibility = 'visible';
      originalText.style.display = 'block';
      successMessage.style.animation = 'none'; // Reset animation
    }, 2000); // Corresponds to the animation duration
}

class SpectrumSample extends Object {
    constructor({ amplitude_rdBFS = soundFloor, frequency_hz = 0 }={}) {
        super();
        this.amplitude_rdBFS = amplitude_rdBFS;
        this.frequency_hz = frequency_hz;
    }
}

function populateFrequencyBands() {
    // Initialize the array to hold the value-pairs
    let valuePairs = [];
    let tmpFrequncyBands = [];
    let tmpPeakAmplitudes = [];
    const selectedIndex = band_selector.selectedIndex;

    const selectedOption = g_globalFrequencyBand[selectedIndex];

    const BAND = selectedOption.end;

    for (let band = selectedOption.start; band <= BAND; band += step) {
        valuePairs.push({ x: band, y: soundFloor });
        tmpFrequncyBands.push(new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }));
        tmpPeakAmplitudes.push(new SpectrumSample({ amplitude_rdBFS : soundFloor, frequency_hz : band }));
    }

    peakAmplitudes.LChannel = [...tmpPeakAmplitudes]; // Left Channel
    peakAmplitudes.RChannel = [...tmpPeakAmplitudes]; // Right Channel
    currentFrequencyBand.LChannel = [...tmpFrequncyBands]; // Left Channel
    currentFrequencyBand.RChannel = [...tmpFrequncyBands]; // Right Channel

    return valuePairs;
}

populateFrequencyBands();

// Set up the initial chart
//Chart.defaults.borderColor = '#333';
ctx = myChart.getContext('2d');
myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        //labels: currentFrequencyBand.map(u => {return u + ' Hz';}), 
        datasets: [
            {
                label: 'Left Channel - Amplitude (ndBFS)',
                data: currentFrequencyBand.LChannel.map(sample => ({ x: sample.frequency_hz, y: sample.amplitude_rdBFS })), // Initial empty data
                borderColor: 'rgb(0, 123, 247)',
                backgroundColor: 'rgb(0, 123, 247)',
                borderWidth: 1,
                yAxisID: 'y-axis-amplitude',
                xAxisID: 'x-axis-frequency',
            },
            {
                label: 'Right Channel - Amplitude (ndBFS)',
                data: currentFrequencyBand.RChannel.map(sample => ({ x: sample.frequency_hz, y: sample.amplitude_rdBFS })), // Initial empty data
                borderColor: 'rgb(255, 0, 255)',//'rgb(0,255,123)', 
                backgroundColor: 'rgb(255, 0, 255)',//'rgb(0,255,123)', //
                borderWidth: 1,
                yAxisID: 'y-axis-amplitude-duo',
                xAxisID: 'x-axis-frequency',
                //hidden: true // Avoid mixing Left-/ Right-Channel data
            }]
    },
    options: {
        scales: {
            'y-axis-amplitude': {
                type: 'linear',
                min: 0,
                max: 1,
                title: { 
                    text: 'ndBFS ( Normalized Decibels relative to Full Scale )',
                    display: true,
                },
                display: true,
                //beginAtzero: true,
                position: 'left',
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false, // Hide grid lines offchart
                    color: '#444',
                },
                ticks: {
                    stepSize: .02,
                    // Include dimensional units in ticks
                    callback: function(value, index, ticks) {
                        // call the default formatter, forwarding `this`
                        return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]) + ' ndBFS';
                    }
                }
            },
            'y-axis-amplitude-duo': {
                type: 'linear',
                min: 0,
                max: 1,
                title: { 
                    text: 'ndBFS ( Normalized Decibels relative to Full Scale )',
                    display: true,
                },
                display: true, 
                //beginAtzero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: true, 
                    drawTicks: false, // Hide grid lines offchart
                    color: '#444',
                },
                ticks: {
                    stepSize: .02,
                    // Include dimensional units in ticks
                    callback: function(value, index, ticks) {
                        // call the default formatter, forwarding `this`
                        return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]) + ' ndBFS';
                    }
                }
            },
            'x-axis-frequency': {
                type: 'linear',
                //min: 0,
                //max: 652,
                title: { 
                    text: 'Frequency Band (Hz)',
                    display: true,
                },
                display: true,
                beginAtzero: true,
                position: 'bottom',
                grid: {
                    drawOnChartArea: true,
                    drawTicks: false, // Hide grid lines offchart
                    color: '#444',
                },
                ticks: {
                    stepSize: 4, 
                    // Include dimensional units in ticks
                    callback: function(value, index, ticks) {
                        // call the default formatter, forwarding `this`
                        return Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks]) + ' Hz';
                    }
                }
            }
        },
        plugins: {
            legend: {
                onHover: (event, legendItem, legend) => {
                    event.native.target.style.cursor = 'pointer';
                },
                onLeave: (event, legendItem, legend) => {
                    event.native.target.style.cursor = 'default';
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
                        const tt2 = tooltips[0];
                        //const tmpTimeStep = tt.label;
                        const tmpFrame = tt2.label;
                        /*
                        const tmpAmplitude = tt.formattedValue;
                        const tmpfrequency = tt2.formattedValue;
                        */
                        return `${tmpFrame} Hz`;
                    },
                    label: function(tooltipItem, data) {
                        // tooltipItem is an object containing properties of the tooltip
                        // data is an object containing all data passed to the chart
                        let yLabel = tooltipItem.formattedValue;
                        const xLabel = tooltipItem.dataset.label;
                        //if (xLabel.match(/^Amplitude/)) {
                            yLabel = (xLabel.match(/^L/) ? '(L) ' : '(R)')  + ` - Amplitude: ${yLabel} (ndBFS)`;
                        //}
                        return yLabel;
                    }
                }
            },
        },/*
        onHover: (event, chartElement) => {
            // Change the cursor to 'pointer' if hovering over a label
            event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
        },*/
        animation: false, // Disable animation for performance
        responsive: true,
        maintainAspectRatio: true
    }
});

band_selector.addEventListener('change', function(e) {
    const valuePairs = populateFrequencyBands();
    myChart.data.datasets[0].data = valuePairs;
    myChart.data.datasets[1].data = valuePairs;
    myChart.update();
});

window.addEventListener('resize', () => {
    // Update the chart
    myChart.resize();
});

} catch (e) {
    console.info(`Unexpected error: ${e.message}\n${e.fileName}: line ${e.lineNumber}: col ${e.columnNumber}\nTrace:\n${e.stack}`);
}
