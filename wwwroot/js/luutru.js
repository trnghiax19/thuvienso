// =============================
// 📚 QUẢN LÝ LƯU TRỮ ẤN PHẨM
// =============================

const STORAGE_KEY = "archives";
let archives = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ======= HIỂN THỊ THÔNG BÁO NHANH (Toast) =======
function showArchiveToast(msg, type = "success") {
    const toast = document.getElementById("archiveToast");
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ======= CẬP NHẬT LOCALSTORAGE =======
function saveArchives() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
    renderArchives();
}

// ======= THÊM MỚI LƯU TRỮ =======
function addArchive() {
    const f = document.getElementById("archiveForm");
    const title = f.Title.value.trim();
    const code = f.Code.value.trim();
    const year = f.Year.value.trim();
    const location = f.Location.value.trim();
    const status = f.Status.value;
    const notes = f.Notes.value.trim();

    if (!title) {
        showArchiveToast("⚠️ Vui lòng nhập tên ấn phẩm!", "error");
        return;
    }

    const newArchive = {
        id: Date.now(),
        title,
        code,
        year,
        location,
        status,
        notes,
        date: new Date().toLocaleDateString("vi-VN")
    };

    archives.push(newArchive);
    saveArchives();
    f.reset();
    showArchiveToast("✅ Đã thêm ấn phẩm lưu trữ!");
}

// ======= XÓA TẤT CẢ =======
function clearAllArchives() {
    if (confirm("Bạn có chắc muốn xóa TẤT CẢ lưu trữ?")) {
        archives = [];
        saveArchives();
        showArchiveToast("🗑️ Đã xóa toàn bộ danh sách!", "error");
    }
}

// ======= XÓA 1 DÒNG =======
function deleteArchive(id) {
    if (confirm("Xóa ấn phẩm này khỏi danh sách?")) {
        archives = archives.filter(a => a.id !== id);
        saveArchives();
        showArchiveToast("🗑️ Đã xóa ấn phẩm!");
    }
}

// ======= LỌC / TÌM KIẾM =======
function filterArchives() {
    const keyword = document.getElementById("archiveSearch").value.toLowerCase();
    const status = document.getElementById("archiveFilter").value;

    const filtered = archives.filter(a => {
        const matchTitle = a.title.toLowerCase().includes(keyword);
        const matchStatus = status ? a.status === status : true;
        return matchTitle && matchStatus;
    });

    renderArchives(filtered);
}

// ======= HIỂN THỊ DANH SÁCH =======
function renderArchives(list = archives) {
    const tbody = document.querySelector("#archiveTable tbody");
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty">Chưa có dữ liệu lưu trữ nào.</td></tr>`;
        updateStats();
        return;
    }

    list.forEach(a => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${a.title}</td>
            <td>${a.code || "-"}</td>
            <td>${a.year || "-"}</td>
            <td>${a.location || "-"}</td>
            <td>${a.status}</td>
            <td>${a.notes || "-"}</td>
            <td>${a.date}</td>
            <td><button onclick="deleteArchive(${a.id})" class="btn-del">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

// ======= THỐNG KÊ =======
function updateStats() {
    const total = archives.length;
    const good = archives.filter(a => a.status === "Còn tốt").length;
    const bad = archives.filter(a => a.status !== "Còn tốt").length;

    document.getElementById("archiveTotal").textContent = total;
    document.getElementById("archiveGood").textContent = good;
    document.getElementById("archiveBad").textContent = bad;
}

// ======= KHỞI TẠO =======
document.addEventListener("DOMContentLoaded", () => {
    renderArchives();
});
