const stats = [
  { number: '10K+', label: 'Active Users' },
  { number: '99.9%', label: 'Uptime' },
  { number: '50M+', label: 'Data Points' },
  { number: '24/7', label: 'Support' },
]
export default function Stats() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-light md:text-4xl">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
