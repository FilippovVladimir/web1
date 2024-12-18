document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Отменяем стандартное поведение формы

    const x = document.querySelector('input[name="x"]:checked').value;
    const y = document.querySelector('input[name="y"]').value.trim();
    const r = document.querySelector('select[name="r"]').value;

    // Валидация данных
    if (!validateInputs(x, y, r)) {
        alert("Некорректные данные!");
        return;
    }

    // Формируем запрос
    fetch("server-endpoint-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, r }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Обновляем таблицу
            const resultBody = document.getElementById("resultBody");
            const newRow = document.createElement("tr");

            newRow.innerHTML = `
                <td>${x}</td>
                <td>${y}</td>
                <td>${r}</td>
                <td>${data.result ? "Попадание" : "Мимо"}</td>
                <td>${data.currentTime}</td>
                <td>${data.executionTime}</td>
            `;

            resultBody.appendChild(newRow);
        })
        .catch((error) => {
            console.error("Ошибка:", error);
        });
});

function validateInputs(x, y, r) {
    const isXValid = x >= -4 && x <= 4;
    const isYValid = y >= -3 && y <= 3 && !isNaN(y);
    const isRValid = r >= 1 && r <= 3;

    return isXValid && isYValid && isRValid;
}


// let points = JSON.parse(localStorage.getItem('points')) || [];

// document.getElementById('pointForm').addEventListener('submit', function (event) {
//     event.preventDefault();

//     const xElements = document.querySelectorAll('input[name="x"]:checked');
//     const y = document.getElementById('y').value.replace(',', '.');
//     const r = document.getElementById('r').value;

//     if (xElements.length !== 1) {
//         alert('Please select exactly one X coordinate.');
//         return;
//     }

//     const x = xElements[0].value;

//     if (!/^-?\d+(\.\d+)?$/.test(y) || y < -3 || y > 3) {
//         alert("Please enter a valid Y coordinate between -3 and 3.");
//         console.warn("Invalid Y value:", y);
//         return;
//     }
    
//     const data = `x=${encodeURIComponent(x)}&y=${encodeURIComponent(y[0])}&r=${encodeURIComponent(r)}`;

   
//     fetch('/fcgi-bin/server.jar', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: data
//     })
//     .then(response => response.json())
//     .then(result => {
//         const resultBody = document.getElementById('resultBody');
//         const newRow = document.createElement('tr');

//         newRow.innerHTML = `
//             <td>${x}</td>
//             <td>${y}</td>
//             <td>${r}</td>
//             <td>${result.result !== undefined ? (result.result ? 'true' : 'false') : 'undefined'}</td>
//             <td>${result.currentTime !== undefined ? result.currentTime : 'undefined'}</td>
//             <td>${result.executionTime !== undefined ? result.executionTime : 'undefined'}</td>
//         `;
//         resultBody.appendChild(newRow);

        
//         points.push({ x: parseFloat(x), y: parseFloat(y[0]), r: parseFloat(r), result: result.result });
//         localStorage.setItem('points', JSON.stringify(points)); 
//     })
//     .catch(error => console.error('Error:', error));
// });

// window.addEventListener('load', function() {
//     localStorage.removeItem('points');  
//     points = [];  
// });