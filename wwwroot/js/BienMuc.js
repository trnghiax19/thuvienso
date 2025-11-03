// ========================
// catalog.js (MARC rút gọn chuẩn)
// ========================
var catalogs = [
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-1234-567" }] },
                { tag: "100", subfields: [{ code: "a", value: "Nguyễn Văn A" }] },
                { tag: "245", subfields: [{ code: "a", value: "Lập trình C#" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hà Nội" }, { code: "b", value: "NXB Kim Đồng" }, { code: "c", value: "2022" }] },
                { tag: "300", subfields: [{ code: "a", value: "250 trang, 20 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Sách hướng dẫn lập trình C# cơ bản." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-2345-678" }] },
                { tag: "100", subfields: [{ code: "a", value: "Trần Thị B" }] },
                { tag: "245", subfields: [{ code: "a", value: "Java nâng cao" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hà Nội" }, { code: "b", value: "NXB Trẻ" }, { code: "c", value: "2021" }] },
                { tag: "300", subfields: [{ code: "a", value: "300 trang, 22 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Hướng dẫn nâng cao lập trình Java." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-3456-789" }] },
                { tag: "100", subfields: [{ code: "a", value: "Lê Văn C" }] },
                { tag: "245", subfields: [{ code: "a", value: "Python cơ bản" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hồ Chí Minh" }, { code: "b", value: "NXB Tổng Hợp TP.HCM" }, { code: "c", value: "2020" }] },
                { tag: "300", subfields: [{ code: "a", value: "200 trang, 19 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Giới thiệu Python cho người mới bắt đầu." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-4567-890" }] },
                { tag: "100", subfields: [{ code: "a", value: "Phạm Thị D" }] },
                { tag: "245", subfields: [{ code: "a", value: "JavaScript nâng cao" }] },
                { tag: "260", subfields: [{ code: "a", value: "Đà Nẵng" }, { code: "b", value: "NXB Đà Nẵng" }, { code: "c", value: "2019" }] },
                { tag: "300", subfields: [{ code: "a", value: "280 trang, 21 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Hướng dẫn lập trình web với JavaScript." }] }
            ]
        },
        status: "Ẩn"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-5678-901" }] },
                { tag: "100", subfields: [{ code: "a", value: "Hoàng Văn E" }] },
                { tag: "245", subfields: [{ code: "a", value: "HTML & CSS cơ bản" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hà Nội" }, { code: "b", value: "NXB Giáo Dục" }, { code: "c", value: "2021" }] },
                { tag: "300", subfields: [{ code: "a", value: "180 trang, 20 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Học cách thiết kế web với HTML và CSS." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-6789-012" }] },
                { tag: "100", subfields: [{ code: "a", value: "Ngô Thị F" }] },
                { tag: "245", subfields: [{ code: "a", value: "SQL cho người mới" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hồ Chí Minh" }, { code: "b", value: "NXB Trẻ" }, { code: "c", value: "2022" }] },
                { tag: "300", subfields: [{ code: "a", value: "220 trang, 21 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Hướng dẫn cơ bản về cơ sở dữ liệu SQL." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-7890-123" }] },
                { tag: "100", subfields: [{ code: "a", value: "Vũ Văn G" }] },
                { tag: "245", subfields: [{ code: "a", value: "C++ nâng cao" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hà Nội" }, { code: "b", value: "NXB Khoa Học" }, { code: "c", value: "2018" }] },
                { tag: "300", subfields: [{ code: "a", value: "350 trang, 23 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Sách nâng cao về lập trình C++." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-8901-234" }] },
                { tag: "100", subfields: [{ code: "a", value: "Trương Thị H" }] },
                { tag: "245", subfields: [{ code: "a", value: "PHP & MySQL" }] },
                { tag: "260", subfields: [{ code: "a", value: "Đà Nẵng" }, { code: "b", value: "NXB Đà Nẵng" }, { code: "c", value: "2020" }] },
                { tag: "300", subfields: [{ code: "a", value: "260 trang, 21 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Học lập trình web với PHP và MySQL." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-9012-345" }] },
                { tag: "100", subfields: [{ code: "a", value: "Đặng Văn I" }] },
                { tag: "245", subfields: [{ code: "a", value: "Machine Learning cơ bản" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hà Nội" }, { code: "b", value: "NXB Trẻ" }, { code: "c", value: "2023" }] },
                { tag: "300", subfields: [{ code: "a", value: "320 trang, 24 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Giới thiệu Machine Learning cho người mới." }] }
            ]
        },
        status: "Hiện"
    },
    {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: "978-604-0123-456" }] },
                { tag: "100", subfields: [{ code: "a", value: "Bùi Thị K" }] },
                { tag: "245", subfields: [{ code: "a", value: "Data Science nâng cao" }] },
                { tag: "260", subfields: [{ code: "a", value: "Hồ Chí Minh" }, { code: "b", value: "NXB Tổng Hợp TP.HCM" }, { code: "c", value: "2022" }] },
                { tag: "300", subfields: [{ code: "a", value: "400 trang, 25 cm" }] },
                { tag: "500", subfields: [{ code: "a", value: "Học Data Science chuyên sâu." }] }
            ]
        },
        status: "Hiện"
    }
];


var currentPage = 1;
var rowsPerPage = 8;
var editIndex = null;

function getMarcValue(marc, tag, code) {
    const field = marc.fields.find(f => f.tag === tag);
    if (!field) return "";
    const sub = field.subfields.find(s => s.code === code);
    return sub ? sub.value : "";
}

function renderTable() {
    var tbody = $("#catalogBody");
    tbody.empty();

    var filtered = filterData();
    var start = (currentPage - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    var paginated = filtered.slice(start, end);

    $.each(paginated, function (i, item) {
        const marc = item.marc;
        var stt = start + i + 1;

        var isbn = getMarcValue(marc, "020", "a");
        var author = getMarcValue(marc, "100", "a");
        var title = getMarcValue(marc, "245", "a");
        var place = getMarcValue(marc, "260", "a");
        var publisher = getMarcValue(marc, "260", "b");
        var year = getMarcValue(marc, "260", "c");
        var desc = getMarcValue(marc, "300", "a");
        var note = getMarcValue(marc, "500", "a");
        var status = item.status;

        var statusLabel = status === "Hiện"
            ? '<span class="label label-success">Hiện</span>'
            : '<span class="label label-default">Ẩn</span>';

        tbody.append(`
            <tr>
                <td><input type="checkbox" class="row-checkbox" onclick="updateDeleteButton()"></td>
                <td>${stt}</td>
                <td>${isbn}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td>${place ? place + " - " : ""}${publisher} (${year})</td>
                <td>${desc}</td>
                <td>${note}</td>
                <td>${statusLabel}</td>

                <td>
                    <button class="btn btn-xs btn-warning" onclick="openEditModal(${start + i})" title="Sửa">
        <span class="glyphicon glyphicon-wrench"></span>
    </button>
    <button class="btn btn-xs btn-danger" onclick="deleteRow(${start + i})" title="Xoá">
        <span class="glyphicon glyphicon-trash"></span>
    </button>
                </td>
            </tr>`);
    });

    updatePagination(filtered.length);
    $("#recordCount").text(`Tổng số: ${filtered.length} biên mục`);
    updateDeleteButton();
}



// Phân trang
function updatePagination(totalRecords) {
    var totalPages = Math.ceil(totalRecords / rowsPerPage);
    var pagination = $("#pagination");
    pagination.empty();

    function pageButton(page, label = page) {
        var active = (page === currentPage) ? "active" : "";
        pagination.append(`<li class="${active}"><a href="#" onclick="gotoPage(${page})">${label}</a></li>`);
    }

    if (currentPage > 1) {
        pageButton(1, "&laquo;");
        pageButton(currentPage - 1, "&lt;");
    }

    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pagination.append('<li><span>...</span></li>');
    for (var i = start; i <= end; i++) pageButton(i);
    if (end < totalPages) pagination.append('<li><span>...</span></li>');

    if (currentPage < totalPages) {
        pageButton(currentPage + 1, "&gt;");
        pageButton(totalPages, "&raquo;");
    }
}

function gotoPage(page) {
    currentPage = page;
    renderTable();
}

// Tìm kiếm
function filterData() {
    var keyword = $("#searchBox").val().toLowerCase();
    return catalogs.filter(c => {
        const m = c.marc;
        return (
            getMarcValue(m, "245", "a").toLowerCase().includes(keyword) ||
            getMarcValue(m, "100", "a").toLowerCase().includes(keyword) ||
            getMarcValue(m, "260", "b").toLowerCase().includes(keyword)
        );
    });
}

function filterTable() {
    currentPage = 1;
    renderTable();
}



// Modal thêm/sửa
function openAddModal() {
    editIndex = null;
    $("#modalTitle").text("Thêm biên mục");
    $("#catalogForm")[0].reset();
    $('#catalogModal').modal('show');
}

function openEditModal(index) {
    editIndex = index;
    var m = catalogs[index].marc;
    $("#modalTitle").text("Sửa biên mục");

    $("#isbn").val(getMarcValue(m, "020", "a"));
    $("#author").val(getMarcValue(m, "100", "a"));
    $("#title").val(getMarcValue(m, "245", "a"));
    $("#publisher_place").val(getMarcValue(m, "260", "a"));
    $("#publisher").val(getMarcValue(m, "260", "b"));
    $("#year").val(getMarcValue(m, "260", "c"));
    $("#physical_desc").val(getMarcValue(m, "300", "a"));
    $("#note").val(getMarcValue(m, "500", "a"));
    $("#status").val(catalogs[index].status);

    $("#catalogModal").modal("show");
}

// Lưu biên mục
function saveCatalog(e) {
    e.preventDefault();
    var item = {
        marc: {
            leader: "00000nam a2200000 i 4500",
            fields: [
                { tag: "020", subfields: [{ code: "a", value: $("#isbn").val() }] },
                { tag: "100", subfields: [{ code: "a", value: $("#author").val() }] },
                { tag: "245", subfields: [{ code: "a", value: $("#title").val() }] },
                {
                    tag: "260",
                    subfields: [
                        { code: "a", value: $("#publisher_place").val() },
                        { code: "b", value: $("#publisher").val() },
                        { code: "c", value: $("#year").val() }
                    ]
                },
                { tag: "300", subfields: [{ code: "a", value: $("#physical_desc").val() }] },
                { tag: "500", subfields: [{ code: "a", value: $("#note").val() }] }
            ]
        },
        status: $("#status").val() || "Hiện"
    };

    if (editIndex !== null) catalogs[editIndex] = item;
    else catalogs.push(item);

    $("#catalogModal").modal("hide");
    renderTable();
}

// Xoá
function deleteRow(index) {
    if (confirm("Bạn có chắc muốn xoá biên mục này?")) {
        catalogs.splice(index, 1);
        renderTable();
    }
}

function toggleSelectAll(cb) {
    $(".row-checkbox").prop("checked", cb.checked);
    updateDeleteButton();
}

function updateDeleteButton() {
    var checked = $(".row-checkbox:checked").length;
    $("#deleteSelectedBtn").prop("disabled", checked === 0);
}

function deleteSelected() {
    if (confirm("Bạn có chắc muốn xoá các biên mục đã chọn?")) {
        var indexes = $(".row-checkbox:checked").closest("tr").map(function () {
            return $(this).index() + (currentPage - 1) * rowsPerPage;
        }).get().reverse();

        indexes.forEach(i => catalogs.splice(i, 1));
        renderTable();
    }
}

$("#exportExcelBtn").click(function () {
    var filtered = filterData(); // chỉ xuất dữ liệu đang hiển thị
    var data = filtered.map((item, index) => {
        var m = item.marc;
        return {
            STT: index + 1,
            ISBN: getMarcValue(m, "020", "a"),
            NhanDe: getMarcValue(m, "245", "a"),
            TacGia: getMarcValue(m, "100", "a"),
            XuatBan: `${getMarcValue(m, "260", "a")} - ${getMarcValue(m, "260", "b")} (${getMarcValue(m, "260", "c")})`,
            MoTa: getMarcValue(m, "300", "a"),
            GhiChu: getMarcValue(m, "500", "a"),
            TrangThai: item.status,
            NgonNgu: getMarcValue(m, "041", "a"),
            LoaiHinh: getMarcValue(m, "336", "a"),
            ChuDe: getMarcValue(m, "650", "a")
        };
    });

    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Biên mục");
    XLSX.writeFile(wb, "Danh_sach_bien_muc.xlsx");
});

$("#importExcelBtn").click(function () {
    $("#importExcelInput").click();
});

$("#importExcelInput").change(function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (evt) {
        var data = evt.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });
        var firstSheet = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheet];
        var jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Chuyển jsonData thành catalogs
        catalogs = jsonData.map(row => ({
            marc: {
                leader: "00000nam a2200000 i 4500",
                fields: [
                    { tag: "020", subfields: [{ code: "a", value: row.ISBN }] },
                    { tag: "100", subfields: [{ code: "a", value: row.TacGia }] },
                    { tag: "245", subfields: [{ code: "a", value: row.NhanDe }] },
                    {
                        tag: "260",
                        subfields: [
                            { code: "a", value: row.XuatBan.split(" - ")[0] || "" },
                            { code: "b", value: (row.XuatBan.match(/- (.*?) \(/) || [])[1] || "" },
                            { code: "c", value: (row.XuatBan.match(/\((.*?)\)/) || [])[1] || "" }
                        ]
                    },
                    { tag: "300", subfields: [{ code: "a", value: row.MoTa }] },
                    { tag: "500", subfields: [{ code: "a", value: row.GhiChu }] },
                    { tag: "041", subfields: [{ code: "a", value: row.NgonNgu }] },
                    { tag: "336", subfields: [{ code: "a", value: row.LoaiHinh }] },
                    { tag: "650", subfields: [{ code: "a", value: row.ChuDe }] }
                ]
            },
            status: row.TrangThai || "Hiện"
        }));

        currentPage = 1;
        renderTable();
        alert("Nhập Excel thành công!");
    };
    reader.readAsBinaryString(file);
});





$(document).ready(() => renderTable());
