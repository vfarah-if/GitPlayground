using System.Data.Entity;
using System.Threading.Tasks;
using Git.Domain.EntityFramework.Models;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace Git.Domain.EntityFramework.Unit.Tests
{
    // TODO: Figure out an effective way to unit test ef but for now, the console has been 
    //       a driver for the test
    public class AccidentStatisticRepositoryShould
    {
        private AutoMocker _autoMock;
        private AccidentStatisticRepository _subject;
        private Mock<IAccidentStatisticDbContext> _accidentStatisticDbContextMock;
        private Mock<DbSet<AccidentStatisticDb>> _accidentStatisticsDbSetMock;
        private int _countResult;

        public AccidentStatisticRepositoryShould()
        {
            _autoMock = new AutoMocker();
            _subject = _autoMock.CreateInstance<AccidentStatisticRepository>();
            
            _accidentStatisticsDbSetMock = new Mock<DbSet<AccidentStatisticDb>>();
            _countResult = 4;

            _accidentStatisticDbContextMock = _autoMock.GetMock<IAccidentStatisticDbContext>();
            _accidentStatisticDbContextMock.Setup(x => x.AccidentStatistics)
                .Returns(_accidentStatisticsDbSetMock.Object);
//            _accidentStatisticsDbSetMock
//                .Setup(x => x.CountAsync())
//                .ReturnsAsync(() => _countResult);

            _accidentStatisticDbContextMock.Setup(x => x.AccidentStatistics)
                .Returns(_accidentStatisticsDbSetMock.Object);
        }

        [Fact(Skip = "Need to figure out a good way of testing entity framework when I have time")]
        public async Task CountAccidentStatistics()
        {
            await _subject.Count();

            _accidentStatisticsDbSetMock.Verify(x => x.CountAsync(), Times.Once);
        }
    }
}
