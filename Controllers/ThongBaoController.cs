using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class ThongBaoController : Controller
    {
        private readonly ILogger<ThongBaoController> _logger;

        public ThongBaoController(ILogger<ThongBaoController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
