using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FinalProNewServer.Startup))]
namespace FinalProNewServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
