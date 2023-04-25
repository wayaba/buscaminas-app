export function Header({ title }) {
  return (
    <header className="m-4 text-center">
      <h5 className="text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl text-cyan-50">
        {title}
      </h5>
    </header>
  )
}
