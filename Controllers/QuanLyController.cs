using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class QuanLyController : Controller
    {
        private readonly ILogger<QuanLyController> _logger;

        public QuanLyController(ILogger<QuanLyController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
