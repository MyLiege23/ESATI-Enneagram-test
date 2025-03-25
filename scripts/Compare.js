// scripts/main.js

document.addEventListener("DOMContentLoaded", async () => {
    const typeContainer = document.getElementById("quiz-container");
    const subtypeContainer = document.getElementById("subtype-quiz-container");
    const submitTypeBtn = document.getElementById("submit-btn");
    const submitSubtypeBtn = document.getElementById("subtype-submit-btn");
    const resultOutput = document.getElementById("result-output");
    const subtypeResultOutput = document.getElementById("subtype-result-output");
    const resultsSection = document.getElementById("results");
    const subtypeResultsSection = document.getElementById("subtype-results");
  
    const sliderLabels = ["Strongly disagree", "Somewhat disagree", "Neutral", "Somewhat agree", "Strongly agree"];
  
    const typeMap = {
      1: [2, 16, 18, 29, 43, 54, 56, 64],
      2: [1, 6, 12, 46, 51, 55, 59],
      3: [5, 17, 34, 38, 48, 60, 66],
      4: [8, 20, 25, 30, 37, 39, 41, 53],
      5: [9, 22, 26, 35, 57, 62, 69],
      6: [3, 13, 15, 19, 24, 27, 45, 50, 61],
      7: [11, 14, 28, 33, 40, 42, 68],
      8: [4, 7, 10, 23, 32, 52, 65, 67],
      9: [21, 31, 36, 44, 47, 49, 58, 63]
    };
  
    const subtypeMap = {
      "Self-Preservation": [1, 3, 12, 16, 18, 19, 22, 25, 27, 29],
      "Social": [2, 5, 7, 10, 14, 20, 24, 26, 30],
      "Intimacy": [4, 6, 8, 9, 11, 13, 15, 17, 21, 23, 28]
    };
  
    function updateSliderFill(slider) {
      const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--fill', `${val}%`);
    }
  
    async function loadQuestions(url, container, prefix) {
      const response = await fetch(url);
      const data = await response.json();
      const key = Object.keys(data)[0];
      const questions = data[key];
  
      questions.forEach((q) => {
        const div = document.createElement("div");
        div.className = "question";
  
        const p = document.createElement("p");
        p.textContent = `${q.id}. ${q.text}`;
        div.appendChild(p);
  
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "slider-container";
  
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 4;
        slider.step = 1;
        slider.value = 2;
        slider.name = `${prefix}${q.id}`;
        slider.className = "slider";
        slider.setAttribute("data-filled", "");
        slider.setAttribute("list", `ticks-${prefix}${q.id}`);
        updateSliderFill(slider);
        slider.addEventListener("input", () => updateSliderFill(slider));
  
        const ticklist = document.createElement("datalist");
        ticklist.id = `ticks-${prefix}${q.id}`;
        for (let i = 0; i <= 4; i++) {
          const option = document.createElement("option");
          option.value = i;
          ticklist.appendChild(option);
        }
  
        const labelRow = document.createElement("div");
        labelRow.className = "slider-labels";
  
        sliderLabels.forEach((labelText) => {
          const label = document.createElement("span");
          label.className = "slider-label";
          label.textContent = labelText;
          label.style.flex = "1";
          label.style.textAlign = "center";
          labelRow.appendChild(label);
        });
  
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(ticklist);
        sliderContainer.appendChild(labelRow);
        div.appendChild(sliderContainer);
        container.appendChild(div);
      });
    }
  
    await loadQuestions("data/typeQuestions.json", typeContainer, "t");
    await loadQuestions("data/subtypeQuestions.json", subtypeContainer, "s");
  
    submitTypeBtn.addEventListener("click", () => {
      const scores = {};
      Object.values(typeMap).flat().forEach((id) => {
        const input = document.querySelector(`input[name='t${id}']`);
        scores[id] = input ? parseInt(input.value) : 0;
      });
  
      const results = Object.entries(typeMap).map(([type, ids]) => {
        const total = ids.reduce((sum, id) => sum + (scores[id] || 0), 0);
        return { type: `Type ${type}`, score: total };
      });
  
      results.sort((a, b) => b.score - a.score);
  
      resultOutput.innerHTML = "<ol>" +
        results.map(r => `<li><strong>${r.type}</strong>: ${r.score} points</li>`).join("") +
        "</ol>";
  
      resultsSection.hidden = false;
    });
  
    submitSubtypeBtn.addEventListener("click", () => {
      const scores = {};
      Object.values(subtypeMap).flat().forEach((id) => {
        const input = document.querySelector(`input[name='s${id}']`);
        scores[id] = input ? parseInt(input.value) : 0;
      });
  
      const results = Object.entries(subtypeMap).map(([label, ids]) => {
        const total = ids.reduce((sum, id) => sum + (scores[id] || 0), 0);
        return { label, score: total };
      });
  
      results.sort((a, b) => b.score - a.score);
  
      subtypeResultOutput.innerHTML = "<ol>" +
        results.map(r => `<li><strong>${r.label}</strong>: ${r.score} points</li>`).join("") +
        "</ol>";
  
      subtypeResultsSection.hidden = false;
    });
  });
  