const img = document.getElementById('img');
const button = document.getElementById('submit_button');
const input = document.getElementById('image_url');
const result = document.getElementById('prediction');

const imageInput = document.getElementById("input")
const output = document.getElementById("output")
let imagesArray = []




imageInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        var img = document.getElementById('gunpla');
        img.onload = () => {
            predict(img)
            console.log("a")
        }

        let new_image = URL.createObjectURL(this.files[0])
        img.src = new_image; // Start loading the image
    }

})

async function predict(image) {
    const model = await tf.loadGraphModel("./salida4/model.json");
    class_names = ['HGUC_01_RX-77-2_Guncannon', 'HGUC_02_YMS-15_Gyan', 'HGUC_04_AMX-004_Qubeley', 'HGUC_05_MSN-00100_Hyaku-Shiki', 'HGUC_07_RX-75_Guntank', 'HGUC_08_MSM-03_Gogg', 'HGUC_09_MS-07B_Gouf', 'HGUC_15_AMX-107_Bawoo', 'HGUC_17_MS-09F_Domtropen', 'HGUC_18_RGM-79_GM', 'HGUC_20_MSM-07S_Zgok(Char)', 'HGUC_21_RX-78_Gundam', 'HGUC_22_MSN-02_Zeong', 'HGUC_32_MS-06S_Zaku-II(Char)', 'HGUC_40_MS-06_Zaku II', 'IBO_01_Iron-Blooded-Orphans_Gundam-Barbatos', 'WFM_01_Witch-From-Mercury_Gundam-Lfrith', 'WFM_03_Witch-From-Mercury_Gundam-Aerial', 'WFM_06_Witch-From-Mercury_Chuchu-Demi-Trainer', 'WFM_08_Witch-From-Mercury_Darilbalde']

    var example = tf.browser.fromPixels(image);  // for example


    example = tf.image.resizeBilinear(example, [180, 180]); // Resize the image
    example = example.reshape([1, 180, 180, 3]);
    const model_output = model.predict(example);


    const predictions = model_output.dataSync();
    const probabilities = tf.softmax(predictions).arraySync();
    const sortedIndexes = probabilities.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]);

    cleanTable()

    for (let i = 0; i < 5; i++) {
        const classIndex = sortedIndexes[i][1];
        const className = class_names[classIndex];
        const probability = probabilities[classIndex] * 100;
        console.log(`${className}: ${probability.toFixed(2)}%`);
        agregarFila(className, probability)
    }
}


function cleanTable() {
    var tabla = document.getElementById("result-table-body");
    tabla.innerHTML = ""
}

function agregarFila(nombre, probabilidad) {
    // Obtener la referencia a la tabla
    var tabla = document.getElementById("result-table-body");

    // Crear una nueva fila
    var fila = document.createElement("tr");

    // Dividir el valor de la primera celda
    var partes = nombre.split("_");

    // Crear las celdas de la fila
    for (var i = 0; i < partes.length; i++) {
        var celda = document.createElement("td");
        celda.innerHTML = partes[i];
        fila.appendChild(celda);
    }

    var celda2 = document.createElement("td");
    celda2.innerHTML = probabilidad.toFixed(4);

    fila.appendChild(celda2);

    // Agregar la fila a la tabla
    tabla.appendChild(fila);
}

