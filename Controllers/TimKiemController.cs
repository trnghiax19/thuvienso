using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class TimKiemController : Controller
    {
        private readonly ILogger<TimKiemController> _logger;

        public TimKiemController(ILogger<TimKiemController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult BoSuuTap()
        {
            return View();
        }
    }
}
