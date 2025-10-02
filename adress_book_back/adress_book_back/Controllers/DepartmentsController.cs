using adress_book_back.Interfaces;
using adress_book_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace adress_book_back.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // GET: api/Departments/GetDepartments?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetDepartments(int page = 1, int pageSize = 10)
        {
            var result = await _departmentService.GetDepartments(page, pageSize);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // GET: api/Departments/GetAllDepartments
        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            var result = await _departmentService.GetAllDepartments();
            return Ok(JsonConvert.SerializeObject(result));
        }

        // POST: api/Departments/Save
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] Department department)
        {
            if (department == null) return BadRequest("Invalid department data.");

            var result = await _departmentService.Save(department);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // DELETE: api/Departments/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _departmentService.Delete(id);
            return Ok(JsonConvert.SerializeObject(success));

        }
    }
}
