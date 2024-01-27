document.addEventListener("DOMContentLoaded", (event) => {
    const canvas = document.getElementById("trail-canvas");
    canvas.style.position = "absolute";
    const ctx = canvas.getContext("2d");
    let offsetX = 0;

   

  const mouseCircle = document.getElementById("mouse-circle");

  let spans = [];
  let particleX = 100,
    particleY = 100; // Starting position
  let velocityX = 1,
    velocityY = 1; // Starting velocity

  function updateParticlePosition() {
    // Update particle position
    particleX += velocityX;
    particleY += velocityY;

    // Wrap around to the other side of the screen if the particle goes off one side
    if (particleX < 0) {
      particleX = window.innerWidth - mouseCircle.offsetWidth;
    } else if (particleX > window.innerWidth - mouseCircle.offsetWidth) {
      particleX = 0;
    }
    if (particleY < 0) {
      particleY = window.innerHeight - mouseCircle.offsetHeight;
    } else if (particleY > window.innerHeight - mouseCircle.offsetHeight) {
      particleY = 0;
    }

    // Add randomness to velocity
    velocityX += (Math.random() - 0.5) * 0.8; // Adjust the factor for more or less randomness
    velocityY += (Math.random() - 0.5) * 0.8;

    // Apply the new position
    mouseCircle.style.left = particleX + "px";
    mouseCircle.style.top = particleY + "px";
  }

  function getRandomTextChunk(text, maxWords = 80) {
    const words = text.split(" "); // Split the entire text into words
    const start = Math.floor(Math.random() * (words.length - maxWords));
    return words.slice(start, start + maxWords).join(" "); // Select a chunk of words
  }

  function createSpans(text, parent, data) {
    const arr = text.split(" ");
    arr.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.style.display = "inline-block";
      span.style.marginRight = "5px";
      span.style.transform = `translate(${0}px, ${data[i]}px)`;
      span.style.transition = "transform 0.2s";
      // Calculate the exact position of the span
    const spanRect = span.getBoundingClientRect();
    const spanX = spanRect.left - parent.getBoundingClientRect().left;
    const spanY = spanRect.top - parent.getBoundingClientRect().top;
    
    span.style.transform = `translate(${spanX}px, ${spanY}px)`; // Use the calculated position
    span.style.transition = "transform 0.2s";

    // Store the initial position (offset) as prevPos
    span.prevPos = { x: spanX, y: spanY };

    parent.appendChild(span);
    spans.push(span);

    // Update the offsetX for the next span
    offsetX += spanRect.width + 5;
    });
  }

  function createStrand(key, data) {
    const strand = document.createElement("div");
    strand.className = "strand";

    const innerDiv = document.createElement("div"); // Create an inner div
    innerDiv.className = "inner";
    strand.appendChild(innerDiv);

    strand.style.transform = `translate(0px, 0px)`; // Initial position
    strand.dataset.weatherData = JSON.stringify(data);
    strand.dataset.weatherKey = key;

    // Assign random chunk of text from corpus
    const text = getRandomTextChunk(corpus.join(" "));
    createSpans(text, innerDiv, strand.dataset.weatherData); // Pass innerDiv instead of strand

    document.getElementById("windStrands").appendChild(strand);
  }

  Object.entries(weatherData) // Replace windData with weatherData
    .filter(([key, data]) => key.includes("wind"))
    .forEach(([key, data]) => {
      createStrand(key, data);
    });

    updateCanvasHeight()

    // function draw() {
    //     ctx.canvas.width  = window.innerWidth;
    //     ctx.canvas.height = window.innerHeight;
    //   }

    // Update canvas height function
function updateCanvasHeight() {
    canvas.height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
    canvas.width = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      ctx.strokeStyle = "rgba(0, 127, 255, 0.1)"; 
      // Define the color and opacity of the trail
         ctx.lineWidth = 0.4; // Adjust the line width as needed
         // Set canvas dimensions to match the entire document
    canvas.style.zIndex = "-10";
  }
  function startAnimation() {
    function animate() {
      updateParticlePosition();

      let circleCenterX = particleX + mouseCircle.offsetWidth / 2;
      let circleCenterY = particleY + mouseCircle.offsetHeight / 2;
      let circleRadius = mouseCircle.offsetWidth / 2;
      let interval = 10;

      spans.forEach((span) => {
        const spanRect = span.getBoundingClientRect();
        const spanX = spanRect.left + spanRect.width / 2;
        const spanY = spanRect.top + spanRect.height / 2;
        const spanX_d = spanRect.left + window.scrollX;
        const spanY_d = spanRect.top + window.scrollY;
        const dx = circleCenterX - spanX;
        const dy = circleCenterY - spanY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let moveX;
        let moveY;
        if (
          distance < circleRadius + 5 * Math.random() &&
          interval * Math.random() <= 2
        ) {
          const angle = Math.atan2(dy, dx);
          moveX = Math.cos(angle) * (circleRadius - distance / 2);
          moveY = Math.sin(angle) * (circleRadius - distance / 2);
          span.style.transform = `translate(${moveX}px, ${moveY}px)`;

        //   console.log("spanX, spanY, span.prevPos.x, span.prevPos.y, moveX, moveY", spanX, spanY, span.prevPos.x, span.prevPos.y, moveX, moveY)

          // Draw lines directly using moveX and moveY
          ctx.beginPath();
          ctx.moveTo(spanX_d, spanY_d);
          ctx.lineTo(spanX_d + moveX, spanY_d + moveY);
          ctx.stroke();
        //   draw()
          ctx.closePath();
        } else {
          span.style.transform = `translate(${moveX - 5}px, ${moveY - 5}px)`;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  startAnimation();
});
