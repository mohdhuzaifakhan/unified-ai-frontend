export default function ShadowContainer() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
    </div>
  );
}
