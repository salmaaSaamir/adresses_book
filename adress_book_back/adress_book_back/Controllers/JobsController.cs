using adress_book_back.Interfaces;
using adress_book_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace adress_book_back.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        // GET: api/Jobs/GetJobs?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetJobs(int page = 1, int pageSize = 10)
        {
            var result = await _jobService.GetJobs(page, pageSize);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // GET: api/Jobs/GetAllJobs
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var result = await _jobService.GetAllJobs();
            return Ok(JsonConvert.SerializeObject(result));
        }

        // POST: api/Jobs/Save
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] Job job)
        {
            if (job == null)
                return BadRequest("Invalid job data.");

            var result = await _jobService.Save(job);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // DELETE: api/Jobs/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _jobService.Delete(id);
            return Ok(JsonConvert.SerializeObject(success));
        }
    }
}
