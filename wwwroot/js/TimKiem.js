/* opac.js — clean, professional, Bootstrap3-compatible
   Requires: jQuery (1.11+)
*/

(function ($) {
    'use strict';

    // ---------- sample data (keep/extend as needed) ----------
    const SAMPLE_DATA = [
        { id: 1, title: "Tổng quan Văn học Việt Nam hiện đại", author: "Nguyễn Văn A", year: 2021, lang: "vi", type: "Sách", hasFile: true, views: 1254, subject: "Văn học", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800", desc: "Tổng hợp các tác phẩm tiêu biểu thời kỳ hiện đại." },
        { id: 2, title: "Cơ sở Kinh tế học", author: "Trần Thị B", year: 2022, lang: "vi", type: "Sách", hasFile: false, views: 982, subject: "Kinh tế", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800", desc: "Giáo trình nhập môn kinh tế dành cho sinh viên đại học." },
        { id: 3, title: "Ứng dụng AI trong Giáo dục", author: "Lê Minh B", year: 2024, lang: "en", type: "Tài liệu số", hasFile: true, views: 875, subject: "Công nghệ", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800", desc: "Nghiên cứu về việc ứng dụng trí tuệ nhân tạo trong giáo dục." },
        { id: 4, title: "Phân tích dữ liệu lớn", author: "Phạm C", year: 2019, lang: "en", type: "Luận văn", hasFile: true, views: 512, subject: "Công nghệ", image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800", desc: "Luận văn nghiên cứu quy trình xử lý dữ liệu lớn." },
        { id: 5, title: "Lịch sử Việt Nam giai đoạn đổi mới", author: "Vũ D", year: 2010, lang: "vi", type: "Sách", hasFile: false, views: 740, subject: "Lịch sử", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", desc: "Tư liệu về sự phát triển xã hội Việt Nam từ 1986 đến nay." },
        { id: 6, title: "Pháp luật và Xã hội", author: "Nguyễn Văn E", year: 2020, lang: "vi", type: "Tài liệu", hasFile: true, views: 620, subject: "Luật học", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", desc: "Phân tích mối quan hệ giữa pháp luật và xã hội hiện đại." },
        { id: 7, title: "Cấu trúc dữ liệu và Giải thuật", author: "Trần Văn F", year: 2023, lang: "vi", type: "Sách", hasFile: true, views: 1105, subject: "Tin học", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800", desc: "Tổng hợp các cấu trúc dữ liệu và giải thuật cơ bản." },
        { id: 8, title: "Kỹ năng mềm cho sinh viên", author: "Phạm G", year: 2018, lang: "vi", type: "Tài liệu", hasFile: false, views: 824, subject: "Giáo dục", image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800", desc: "Rèn luyện kỹ năng giao tiếp, làm việc nhóm và lãnh đạo." },
        { id: 9, title: "Blockchain và Tài chính số", author: "Đỗ H", year: 2024, lang: "en", type: "Tài liệu số", hasFile: true, views: 1375, subject: "Công nghệ", image: "https://images.unsplash.com/photo-1621905251189-08b45d7b73e3?w=800", desc: "Nghiên cứu ứng dụng blockchain trong lĩnh vực tài chính." },
        { id: 10, title: "Tư tưởng Hồ Chí Minh", author: "Nguyễn I", year: 2015, lang: "vi", type: "Sách", hasFile: true, views: 920, subject: "Chính trị", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", desc: "Phân tích hệ thống tư tưởng Hồ Chí Minh về con người và xã hội." },
        { id: 11, title: "Phương pháp Nghiên cứu Khoa học", author: "Trần J", year: 2021, lang: "vi", type: "Giáo trình", hasFile: true, views: 650, subject: "Giáo dục", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800", desc: "Giới thiệu quy trình và kỹ năng thực hiện nghiên cứu khoa học." },
        { id: 12, title: "Quản trị dự án CNTT", author: "Lê K", year: 2022, lang: "en", type: "Tài liệu", hasFile: true, views: 1040, subject: "Công nghệ", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800", desc: "Hướng dẫn quản lý dự án công nghệ thông tin chuyên nghiệp." },
        { id: 13, title: "Tài chính doanh nghiệp", author: "Ngô L", year: 2019, lang: "vi", type: "Sách", hasFile: false, views: 810, subject: "Kinh tế", image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800", desc: "Phân tích quản trị tài chính trong doanh nghiệp Việt Nam." },
        { id: 14, title: "Mỹ học trong nghệ thuật", author: "Phan M", year: 2016, lang: "vi", type: "Tài liệu", hasFile: true, views: 560, subject: "Nghệ thuật", image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800", desc: "Khám phá vẻ đẹp nghệ thuật qua lăng kính mỹ học." },
        { id: 15, title: "An toàn thông tin mạng", author: "Nguyễn N", year: 2024, lang: "en", type: "Giáo trình", hasFile: true, views: 1530, subject: "Công nghệ", image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8d6?w=800", desc: "Tài liệu hướng dẫn bảo mật và phòng chống tấn công mạng." }
    ];

    // ---------- state ----------
    const state = {
        q: '',
        filters: { subject: '', type: '', yearFrom: '', yearTo: '', fulltext: false, hasfile: false, lang_vn: false },
        sort: 'relevance',
        view: 'grid',
        perPage: 6,
        page: 1,
        data: SAMPLE_DATA
    };

    // ---------- utility ----------
    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"'`]/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[m];
        });
    }

    // safe image fallback
    function imageFallback(imgEl) {
        imgEl.on('error', function () {
            $(this).attr('src', 'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial" font-size="18">No image</text></svg>'));
        });
    }

    // apply filters
    function getFilteredSorted() {
        let data = state.data.slice();

        // keyword
        if (state.q) {
            const q = state.q.toLowerCase();
            data = data.filter(d => (d.title + ' ' + d.author + ' ' + d.desc).toLowerCase().indexOf(q) !== -1);
        }

        // simple filters
        if (state.filters.subject) data = data.filter(d => d.subject === state.filters.subject);
        if (state.filters.type) data = data.filter(d => d.type === state.filters.type);
        if (state.filters.yearFrom) data = data.filter(d => Number(d.year) >= Number(state.filters.yearFrom));
        if (state.filters.yearTo) data = data.filter(d => Number(d.year) <= Number(state.filters.yearTo));
        if (state.filters.fulltext) data = data.filter(d => d.hasFile === true);
        if (state.filters.hasfile) data = data.filter(d => d.hasFile === true);
        if (state.filters.lang_vn) data = data.filter(d => d.lang === 'vi');

        // sort
        if (state.sort === 'date_desc') data.sort((a, b) => b.year - a.year);
        else if (state.sort === 'date_asc') data.sort((a, b) => a.year - b.year);
        else if (state.sort === 'views_desc') data.sort((a, b) => b.views - a.views);
        // relevance = original order (already preserved)

        return data;
    }

    // render pagination (Bootstrap 3)
    function renderPagination(totalItems) {
        const per = Number($('#per-page').val() || state.perPage);
        const totalPages = Math.max(1, Math.ceil(totalItems / per));
        const $ul = $('#results-pagination ul').empty();

        // hide if only 1 page
        if (totalPages <= 1) {
            $('#results-pagination').hide();
            return;
        }
        $('#results-pagination').show();

        const addLi = (label, page, disabled, active) => {
            const $li = $('<li></li>');
            if (disabled) $li.addClass('disabled');
            if (active) $li.addClass('active');
            const $a = $('<a href="#" aria-label="page"></a>').text(label).attr('data-page', page);
            $li.append($a);
            $ul.append($li);
        };

        addLi('«', Math.max(1, state.page - 1), state.page === 1, false);

        // if many pages, show a window (e.g. 1 ... 4 5 6 ... N)
        const maxButtons = 7;
        let start = 1, end = totalPages;
        if (totalPages > maxButtons) {
            const half = Math.floor(maxButtons / 2);
            start = Math.max(1, state.page - half);
            end = Math.min(totalPages, start + maxButtons - 1);
            if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
        }

        if (start > 1) {
            addLi(1, 1, false, state.page === 1);
            if (start > 2) $ul.append('<li class="disabled"><span>…</span></li>');
        }

        for (let i = start; i <= end; i++) addLi(i, i, false, i === state.page);

        if (end < totalPages) {
            if (end < totalPages - 1) $ul.append('<li class="disabled"><span>…</span></li>');
            addLi(totalPages, totalPages, false, state.page === totalPages);
        }

        addLi('»', Math.min(totalPages, state.page + 1), state.page === totalPages, false);
    }

    // render results
    function renderResults() {
        const data = getFilteredSorted();
        const total = data.length;
        $('#results-count').text(total + ' kết quả');

        // per-page & page reset
        state.perPage = Number($('#per-page').val() || state.perPage);
        const pages = Math.max(1, Math.ceil(total / state.perPage));
        if (state.page > pages) state.page = 1;

        const start = (state.page - 1) * state.perPage;
        const pageData = data.slice(start, start + state.perPage);

        const $container = $('#results-container').empty();

        if (state.view === 'grid') {
            pageData.forEach(d => {
                const $col = $('<div class="col-sm-6 col-md-4"></div>');
                const $card = $(
                    `<div class="result-card panel panel-default">
              <div class="panel-body">
                <img class="thumb" src="${escapeHtml(d.image)}" alt="${escapeHtml(d.title)}">
                <h4>${escapeHtml(d.title)}</h4>
                <div class="meta">Tác giả: ${escapeHtml(d.author)} • ${d.year} • ${escapeHtml(d.type)}</div>
                <p class="text-muted small">${escapeHtml(d.desc)}</p>
                <div class="actions text-right">
                  <button class="btn btn-xs btn-success btn-download" data-id="${d.id}"><i class="glyphicon glyphicon-download"></i> Tải</button>
                  <button class="btn btn-xs btn-default btn-detail" data-id="${d.id}"><i class="glyphicon glyphicon-eye-open"></i> Chi tiết</button>
                </div>
              </div>
            </div>`
                );
                $col.append($card);
                $container.append($col);
                imageFallback($card.find('img.thumb'));
            });
            $('#results-container').removeClass('view-list').addClass('row');
        } else {
            pageData.forEach(d => {
                const $col = $('<div class="col-xs-12"></div>');
                const $card = $(
                    `<div class="result-card panel panel-default">
              <div class="panel-body" style="display:flex;flex-direction:row;align-items:flex-start;">
                <img class="thumb" src="${escapeHtml(d.image)}" alt="${escapeHtml(d.title)}" style="width:120px;height:160px;object-fit:cover;margin-right:12px;">
                <div style="flex:1">
                  <h4>${escapeHtml(d.title)}</h4>
                  <div class="meta">Tác giả: ${escapeHtml(d.author)} • ${d.year} • ${escapeHtml(d.type)}</div>
                  <p class="text-muted small">${escapeHtml(d.desc)}</p>
                  <div class="actions text-right">
                    <button class="btn btn-xs btn-success btn-download" data-id="${d.id}"><i class="glyphicon glyphicon-download"></i> Tải</button>
                    <button class="btn btn-xs btn-default btn-detail" data-id="${d.id}"><i class="glyphicon glyphicon-eye-open"></i> Chi tiết</button>
                  </div>
                </div>
              </div>
            </div>`
                );
                $col.append($card);
                $container.append($col);
                imageFallback($card.find('img.thumb'));
            });
            $('#results-container').removeClass('row').addClass('view-list');
        }

        // render pagination
        renderPagination(total);
    }

    // debounce helper
    function debounce(fn, wait) {
        let t;
        return function () {
            const args = arguments;
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // event bindings (single, safe delegation)
    function bindEvents() {
        // search
        $('#btn-search').off('click').on('click', function () {
            state.q = $('#opac-search').val().trim();
            state.page = 1;
            renderResults();
        });
        $('#opac-search').off('keyup').on('keyup', debounce(function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                $('#btn-search').click();
            } else {
                // optional: live search while typing (uncomment if wanted)
                // state.q = $(this).val().trim(); state.page = 1; renderResults();
            }
        }, 250));

        // checkboxes
        $('#chk-fulltext').off('change').on('change', function () { state.filters.fulltext = this.checked; state.page = 1; renderResults(); });
        $('#chk-hasfile').off('change').on('change', function () { state.filters.hasfile = this.checked; state.page = 1; renderResults(); });
        $('#chk-vn').off('change').on('change', function () { state.filters.lang_vn = this.checked; state.page = 1; renderResults(); });

        // sort menu
        $('#sort-menu').off('click').on('click', 'a', function (e) {
            e.preventDefault();
            state.sort = $(this).data('sort') || 'relevance';
            state.page = 1;
            renderResults();
        });

        // view toggle
        $('#view-grid').off('click').on('click', function () { state.view = 'grid'; $('#view-grid').addClass('active'); $('#view-list').removeClass('active'); renderResults(); });
        $('#view-list').off('click').on('click', function () { state.view = 'list'; $('#view-list').addClass('active'); $('#view-grid').removeClass('active'); renderResults(); });

        // per-page
        $('#per-page').off('change').on('change', function () { state.perPage = Number(this.value); state.page = 1; renderResults(); });

        // filter apply/reset
        $('#btn-apply').off('click').on('click', function () {
            state.filters.subject = $('#filter-subject').val() || '';
            state.filters.type = $('#filter-type').val() || '';
            state.filters.yearFrom = $('#year-from').val() || '';
            state.filters.yearTo = $('#year-to').val() || '';
            state.page = 1;
            renderResults();
        });
        $('#btn-reset').off('click').on('click', function () {
            $('#filter-subject, #filter-type, #year-from, #year-to').val('');
            $('#chk-fulltext, #chk-hasfile, #chk-vn').prop('checked', false);
            state.filters = { subject: '', type: '', yearFrom: '', yearTo: '', fulltext: false, hasfile: false, lang_vn: false };
            state.q = '';
            $('#opac-search').val('');
            state.page = 1;
            renderResults();
        });

        // pagination click (delegated)
        $('#results-pagination').off('click').on('click', 'a', function (e) {
            e.preventDefault();
            const p = Number($(this).attr('data-page'));
            if (!isNaN(p) && p >= 1) {
                state.page = p;
                renderResults();
                // scroll to results
                $('html, body').animate({ scrollTop: $('#results-container').offset().top - 80 }, 300);
            }
        });

        // tags click (delegated)
        $('#tags-list').off('click').on('click', '.tag', function () {
            const subj = $(this).data('sub');
            $('#filter-subject').val(subj);
            $('#btn-apply').click();
        });

        // results actions (delegated)
        $('#results-container').off('click').on('click', '.btn-detail', function () {
            const id = Number($(this).data('id'));
            const item = SAMPLE_DATA.find(x => x.id === id);
            if (item) {
                $('#detail-img').attr('src', item.image);
                $('#detail-title').text(item.title);
                $('#detail-meta').html('Tác giả: ' + item.author + ' • ' + item.year + ' • ' + item.type);
                $('#detail-desc').text(item.desc);
                $('#modal-detail').modal('show');
            }
        });

        $('#results-container').on('click', '.btn-download', function () {
            const id = Number($(this).data('id'));
            alert('Frontend demo: bắt đầu tải (simulate) tài liệu id=' + id);
        });

        // collection
        $('.btn-collection').off('click').on('click', function () {
            const name = $(this).closest('.collection-item').find('.collection-title').text();
            alert('Mở bộ sưu tập: ' + name + ' (demo)');
        });
    }

    // render tags list from data subjects
    function renderTags() {
        const subjects = [...new Set(SAMPLE_DATA.map(s => s.subject).filter(Boolean))];
        const $tags = $('#tags-list').empty();
        subjects.forEach(s => {
            $('<span>')
                .addClass('tag btn btn-xs btn-default')
                .attr('data-sub', s)
                .text(s)
                .appendTo($tags)
                .css({ marginRight: '6px', marginBottom: '6px' });
        });
    }

    // init
    function init() {
        // ensure per-page select has value corresponding to state
        $('#per-page').val(String(state.perPage));
        renderTags();
        bindEvents();
        renderResults();
    }

    // run when DOM ready
    $(init);

})(jQuery);
