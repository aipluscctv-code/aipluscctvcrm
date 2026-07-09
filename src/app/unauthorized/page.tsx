export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-canvas">
      <h1 className="text-xl font-semibold text-ink">접근 권한이 없습니다</h1>
      <p className="text-sm text-muted">
        이 계정은 허용된 사용자 목록에 없습니다. 관리자에게 문의하세요.
      </p>
    </div>
  );
}
