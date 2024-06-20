let capture;
let photoStage = 0;
let headImage;
let img;
let showLiveFeed = true;
let message = "";
let messageColor = "black";

function preload(){
  headImage=loadImage('PASEK3.png');
}

function setup() {
  createCanvas(1920, 1080);  // Zmieniono rozmiar canvasa
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  textSize(20);
  
  let button = createButton('Zrób zdjęcie');
  let xOffset = (width - 640) / 2;
  let yOffset = (height - 480) / 2;
  button.position(xOffset + 640 / 2 - button.width / 2, yOffset + 480 + 10);  // Wyśrodkowanie przycisku pod kamerą
  button.mousePressed(takePhoto);
}

function draw() {
  background(255);
  image(headImage,0,0,1920,220);
  
  let xOffset = (width - 640) / 2;  // Obliczanie przesunięcia w poziomie
  let yOffset = (height - 480) / 2; // Obliczanie przesunięcia w pionie
  
  if (showLiveFeed) {
    image(capture, xOffset, yOffset, 640, 480);  // Wyśrodkowanie obrazu z kamery
    
    // Rysowanie owalu, aby wskazać miejsce na twarz
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    
    // Rysowanie owalu twarzy
    ellipse(width / 2, height / 2, 200, 300);
    
    // Wyświetlanie instrukcji
    fill(0);
    noStroke();

    textAlign(CENTER, CENTER);
    textStyle(BOLDITALIC);
    text('Umieść twarz w zaznaczonym miejscu i naciśnij "Zrób zdjęcie"', width / 2, yOffset - 30);
  } else {
    // Wyświetlanie przechwyconego obrazu
    image(img, xOffset, yOffset, 640, 480);  // Wyśrodkowanie przechwyconego obrazu
    
    // Wyświetlanie wiadomości w dolnej części wykonanego zdjęcia
    if (message) {
      fill(messageColor);
      noStroke();
      textSize(20);
      textAlign(CENTER, CENTER);
      text(message, xOffset + 320, yOffset + 480 - 30);
    }
  }
}

function takePhoto() {
  if (showLiveFeed) {
    img = capture.get();
    
    if (photoStage === 0) {
      img.filter(BLUR, 3); // Zastosowanie filtru rozmycia
      showMessage("Zdjęcie jest rozmyte, proszę zrobić kolejne.", "red");
    } else if (photoStage === 1) {
      img = increaseBrightness(img, 150); // Zwiększenie jasności, aby symulować prześwietlenie
      showMessage("Zdjęcie jest prześwietlone, proszę zrobić kolejne.", "red");
    } else if (photoStage === 2) {
      img.filter(BLUR, 3); // Zastosowanie filtru rozmycia
      img = increaseBrightness(img, 150); // Zwiększenie jasności, aby symulować prześwietlenie
      showMessage("Zdjęcie jest świetnie wykonane!", "green");
    }

    showLiveFeed = false; // Przestań wyświetlać live feed
    photoStage++;
  } else {
    showLiveFeed = true; // Ponownie wyświetlaj live feed
    message = ""; // Wyczyść wiadomość
  }
}

function increaseBrightness(img, amount) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i] = min(img.pixels[i] + amount, 255);     // Czerwony
    img.pixels[i + 1] = min(img.pixels[i + 1] + amount, 255); // Zielony
    img.pixels[i + 2] = min(img.pixels[i + 2] + amount, 255); // Niebieski
  }
  img.updatePixels();
  return img;
}

function showMessage(msg, color) {
  message = msg;
  messageColor = color;
}
