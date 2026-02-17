using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Simoona.Modern.Api.ReadDb;

public sealed class ReadOnlySaveGuardInterceptor : SaveChangesInterceptor
{
    private const string ErrorMessage =
        "Write operations are disabled for this milestone. Read-only data access only.";

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        throw new InvalidOperationException(ErrorMessage);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException(ErrorMessage);
    }
}
