<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

// ── Pagination ───────────────────────────────────────────────────────────────
$perPage = 50;
$page    = max(1, (int) ($_GET["page"] ?? 1));
$offset  = ($page - 1) * $perPage;

// ── Search ───────────────────────────────────────────────────────────────────
$search     = trim((string) ($_GET["q"] ?? ""));
$courseFilt = trim((string) ($_GET["course"] ?? ""));

try {
    $db = cms_db();

    // Build WHERE clause
    $where  = [];
    $params = [];
    if ($search !== "") {
        $where[]          = "(name LIKE :q OR email LIKE :q OR mobile_number LIKE :q)";
        $params[":q"]     = "%" . $search . "%";
    }
    if ($courseFilt !== "") {
        $where[]              = "course_name = :course";
        $params[":course"]    = $courseFilt;
    }

    $whereSQL = $where ? ("WHERE " . implode(" AND ", $where)) : "";

    // Total count
    $countStmt = $db->prepare("SELECT COUNT(*) FROM `leads` {$whereSQL}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();
    $totalPages = max(1, (int) ceil($total / $perPage));

    // Fetch page
    $stmt = $db->prepare(
        "SELECT id, name, email, mobile_number, course_name, lead_form_name, source_page, ip_address, created_at
         FROM `leads` {$whereSQL}
         ORDER BY created_at DESC
         LIMIT :limit OFFSET :offset"
    );
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(":limit",  $perPage, PDO::PARAM_INT);
    $stmt->bindValue(":offset", $offset,  PDO::PARAM_INT);
    $stmt->execute();
    $leads = $stmt->fetchAll();

    // Distinct course list for filter dropdown
    $courses = $db->query("SELECT DISTINCT course_name FROM `leads` WHERE course_name IS NOT NULL AND course_name != '' ORDER BY course_name")->fetchAll(PDO::FETCH_COLUMN);

} catch (Throwable $e) {
    $leads = [];
    $total = 0;
    $totalPages = 1;
    $courses = [];
}

$pageTitle    = "Lead Submissions";
$topbarTitle  = "Lead Submissions";
require __DIR__ . "/../cms/templates/head.php";
require __DIR__ . "/../cms/templates/topbar.php";
?>
<main class="page">
  <div class="container">
    <section class="card section-block">

      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.2rem;">
        <div>
          <h2 style="margin:0;">Lead Submissions</h2>
          <p class="muted" style="margin:0.35rem 0 0;"><?= $total ?> total lead<?= $total !== 1 ? "s" : "" ?> captured from blog forms.</p>
        </div>
        <a href="<?= cms_h(cms_url("/admin/leads.php?export=1" . ($search ? "&q=" . urlencode($search) : "") . ($courseFilt ? "&course=" . urlencode($courseFilt) : ""))) ?>"
           class="btn secondary" style="font-size:0.85rem;">&#8659; Export CSV</a>
      </div>

      <!-- Filters -->
      <form method="get" action="" style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.2rem;">
        <input type="text" name="q" value="<?= cms_h($search) ?>"
               placeholder="Search name / email / mobile…"
               style="flex:1;min-width:180px;padding:0.45rem 0.6rem;border:1px solid #cbd5e1;border-radius:8px;" />
        <select name="course" style="padding:0.45rem 0.6rem;border:1px solid #cbd5e1;border-radius:8px;min-width:200px;">
          <option value="">All Courses</option>
          <?php foreach ($courses as $c): ?>
            <option value="<?= cms_h((string) $c) ?>"<?= $courseFilt === (string) $c ? " selected" : "" ?>><?= cms_h((string) $c) ?></option>
          <?php endforeach; ?>
        </select>
        <button type="submit" class="btn">Filter</button>
        <?php if ($search !== "" || $courseFilt !== ""): ?>
          <a href="<?= cms_h(cms_url("/admin/leads.php")) ?>" class="btn secondary">Clear</a>
        <?php endif; ?>
      </form>

      <?php if (empty($leads)): ?>
        <p class="muted" style="text-align:center;padding:2rem 0;">No leads found<?= ($search !== "" || $courseFilt !== "") ? " matching your filters" : " yet" ?>.</p>
      <?php else: ?>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Course</th>
                <th>Blog / Form</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($leads as $lead): ?>
                <tr>
                  <td class="muted"><?= (int) $lead["id"] ?></td>
                  <td><?= cms_h((string) $lead["name"]) ?></td>
                  <td><a href="mailto:<?= cms_h((string) $lead["email"]) ?>"><?= cms_h((string) $lead["email"]) ?></a></td>
                  <td><?= cms_h((string) $lead["mobile_number"]) ?></td>
                  <td><?= cms_h((string) ($lead["course_name"] ?? "—")) ?></td>
                  <td class="muted" style="font-size:0.8rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                      title="<?= cms_h((string) ($lead["source_page"] ?? "")) ?>">
                    <?= cms_h((string) ($lead["lead_form_name"] ?? "—")) ?>
                  </td>
                  <td class="muted" style="white-space:nowrap;"><?= cms_h((string) $lead["created_at"]) ?></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
          <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap;">
            <?php for ($p = 1; $p <= $totalPages; $p++): ?>
              <?php $pUrl = cms_url("/admin/leads.php?page={$p}" . ($search ? "&q=" . urlencode($search) : "") . ($courseFilt ? "&course=" . urlencode($courseFilt) : "")); ?>
              <a href="<?= cms_h($pUrl) ?>" class="btn<?= $p === $page ? "" : " secondary" ?>" style="min-width:2.4rem;text-align:center;"><?= $p ?></a>
            <?php endfor; ?>
          </div>
        <?php endif; ?>
      <?php endif; ?>

    </section>
  </div>
</main>
<?php
// ── CSV Export ───────────────────────────────────────────────────────────────
if (isset($_GET["export"])) {
    // Re-run without pagination to get all matching rows
    try {
        $db  = cms_db();
        $where2  = [];
        $params2 = [];
        if ($search !== "") {
            $where2[]       = "(name LIKE :q OR email LIKE :q OR mobile_number LIKE :q)";
            $params2[":q"]  = "%" . $search . "%";
        }
        if ($courseFilt !== "") {
            $where2[]             = "course_name = :course";
            $params2[":course"]   = $courseFilt;
        }
        $whereSQL2 = $where2 ? ("WHERE " . implode(" AND ", $where2)) : "";
        $expStmt = $db->prepare(
            "SELECT id, name, email, mobile_number, course_name, lead_form_name, source_page, ip_address, created_at
             FROM `leads` {$whereSQL2} ORDER BY created_at DESC"
        );
        $expStmt->execute($params2);
        $allLeads = $expStmt->fetchAll();

        // Output
        header("Content-Type: text/csv; charset=utf-8");
        header('Content-Disposition: attachment; filename="leads-' . date('Y-m-d') . '.csv"');
        ob_end_clean();
        $out = fopen("php://output", "w");
        fputcsv($out, ["ID", "Name", "Email", "Mobile", "Course", "Form / Blog", "Source Page", "IP", "Date"]);
        foreach ($allLeads as $row) {
            fputcsv($out, [
                $row["id"],
                $row["name"],
                $row["email"],
                $row["mobile_number"],
                $row["course_name"] ?? "",
                $row["lead_form_name"] ?? "",
                $row["source_page"] ?? "",
                $row["ip_address"] ?? "",
                $row["created_at"],
            ]);
        }
        fclose($out);
        exit;
    } catch (Throwable $e) {
        // Silently ignore export errors
    }
}
require __DIR__ . "/../cms/templates/foot.php";
