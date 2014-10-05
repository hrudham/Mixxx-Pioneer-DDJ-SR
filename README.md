#Pioneer DDJ-SR MIDI Mapping for Mixxx

## Description 

This is my attempt at mapping the [Pioneer DDJ-SR](http://pioneerdj.com/english/products/controller/ddj-sr.html) for [Mixxx](http://www.mixxx.org/). I wrote this specifically with Mixxx v1.11.0 in mind.

##Hurry up and tell me how to use it

If you just want to get your controller working with with Mixxx without bothering about the details much, then do the following:

1. Download the following two files:
    - [PIONEER_DDJ-SR.midi.xml](https://github.com/hrudham/Mixxx-Pioneer-DDJ-SR/blob/master/PIONEER_DDJ-SR.midi.xml)
    - [PIONEER_DDJ-SR-scripts.js](https://github.com/hrudham/Mixxx-Pioneer-DDJ-SR/blob/master/PIONEER_DDJ-SR-scripts.js)
2. Copy these to the '''[Mixxx Directory]/controllers''' folder. This will probably be one of the following locations:
    - Windows: C:\Program Files\Mixxx\controllers
    - Linux: /usr/share/mixxx/controllers or /usr/local/share/mixxx/controllers
    - OS X: /Applications/Mixxx.app/Contents/Resources/controllers/
3. Open Mixxx, and enjoy using your (semi-functional) controller

## What's implemented?

- General Controls
    - crossfader
- Deck Controls
    - channel volume
    - play / pause
- Jog Wheels
    - Scratching

## Whats missing?

- LEDs in general
- Pitch touching via Jog Wheels
- Performance Pads
- Filter
- Effects
- A whole lot

Be patient; I am working on these :-)

## What will never be implemented?

Some functions of the DDJ-SR quite simply can't be implemented in Mixxx v1.11.0 due to those features quite literally not being available yet.

- Decks 3 and 4.
