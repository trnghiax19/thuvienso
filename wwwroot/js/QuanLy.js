// admin.js
(function ($) {
    $(function () {

        // 🔹 Lưu ngôn ngữ
        const $langSelect = $('#lang-select');
        $langSelect.on('change', function () {
            localStorage.setItem('admin_lang', $(this).val());
        });
        const savedLang = localStorage.getItem('admin_lang');
        if (savedLang) $langSelect.val(savedLang);

        // 🔹 Mở modal
        $('#open-role-manager').on('click', function (e) {
            e.preventDefault();
            $('#roleModal').modal('show');
        });
        $('#open-system-config').on('click', function (e) {
            e.preventDefault();
            $('#configModal').modal('show');
        });

        // 🔹 Tìm kiếm log
        function filterLogs() {
            const query = $('#log-search').val().toLowerCase();
            $('#log-table tbody tr').each(function () {
                $(this).toggle($(this).text().toLowerCase().includes(query));
            });
        }
        $('#btn-search').on('click', filterLogs);
        $('#log-search').on('keyup', function (e) {
            if (e.key === 'Enter') filterLogs();
        });

        // 🔹 Lọc trạng thái dựa vào class tr
        $('.filter-btn').on('click', function () {
            const filter = $(this).data('filter');
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');

            $('#log-table tbody tr').each(function () {
                if (filter === 'all') {
                    $(this).show();
                } else {
                    $(this).toggle($(this).hasClass(filter));
                }
            });
        });


        // 🔹 Form Vai trò
        $('#role-form').on('submit', function (e) {
            e.preventDefault();
            alert('Lưu phân quyền thành công (demo)');
            $('#roleModal').modal('hide');
        });

    });
})

  (jQuery);



