let dictionaries = {
    language: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
    doctype: ["Sách", "Báo", "Luận văn"],
    subject: ["Công nghệ", "Kinh tế", "Văn học"]
};

const dictType = document.getElementById("dictType");
const dictValue = document.getElementById("dictValue");
const addDict = document.getElementById("addDict");
const dictTableBody = document.getElementById("dictTable").querySelector("tbody");

// Render bảng
function renderDictTable() {
    const type = dictType.value;
    dictTableBody.innerHTML = "";

    dictionaries[type].forEach((val, idx) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${val}</td>
            <td>
                <button class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
            </td>
        `;

        tr.querySelector("button").onclick = () => {
            dictionaries[type].splice(idx, 1);
            renderDictTable();
        };

        dictTableBody.appendChild(tr);
    });

    fillDropdowns();
}

// Thêm giá trị
addDict.addEventListener("click", () => {
    const type = dictType.value;
    const value = dictValue.value.trim();
    if (!value) return alert("Vui lòng nhập giá trị!");
    if (!dictionaries[type].includes(value)) {
        dictionaries[type].push(value);
        dictValue.value = "";
        renderDictTable();
    } else {
        alert("Giá trị đã tồn tại!");
    }
});

// Chuyển loại từ điển
dictType.addEventListener("change", renderDictTable);

// Fill dropdown trong modal Catalog
function fillDropdowns() {
    const languageSelect = document.getElementById("languageSelect");
    const doctypeSelect = document.getElementById("doctypeSelect");
    const subjectSelect = document.getElementById("subjectSelect");
    if (!languageSelect || !doctypeSelect || !subjectSelect) return;

    languageSelect.innerHTML = "";
    dictionaries.language.forEach(lang => {
        const opt = document.createElement("option");
        opt.value = lang;
        opt.text = lang;
        languageSelect.add(opt);
    });

    doctypeSelect.innerHTML = "";
    dictionaries.doctype.forEach(dt => {
        const opt = document.createElement("option");
        opt.value = dt;
        opt.text = dt;
        doctypeSelect.add(opt);
    });

    subjectSelect.innerHTML = "";
    dictionaries.subject.forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.text = sub;
        subjectSelect.add(opt);
    });
}

// Khởi tạo
document.addEventListener("DOMContentLoaded", renderDictTable);
