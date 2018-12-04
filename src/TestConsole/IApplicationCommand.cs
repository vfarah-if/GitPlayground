using System.Threading.Tasks;

namespace TestConsole
{
    public interface IApplicationCommand
    {
        Task Execute();
    }
}