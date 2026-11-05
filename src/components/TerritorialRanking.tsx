import { BarChart3, MapPin, ArrowUpRight } from 'lucide-react';
import { departmentStats, rankColors } from '../core/utils/demo-data';

export default function TerritorialRanking({
	selected,
	onSelect,
}: {
	selected: string;
	onSelect: (key: string) => void;
}) {
	const max = Math.max(...departmentStats.map((item) => item.actas), 1);

	const sortedDepartments = [...departmentStats].sort((a, b) => b.actas - a.actas);

	return (
		<section className='dashboard-card min-w-0 p-4 sm:p-5'>
			<header className='dashboard-card-header mb-4'>
				<div className='flex min-w-0 items-center gap-3'>
					<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700'>
						<BarChart3 size={18} />
					</span>

					<div className='min-w-0'>
						<h2 className='dashboard-card-title'>Ranking territorial</h2>
						<p className='mt-0.5 text-xs text-slate-500'>Actas por departamento</p>
					</div>
				</div>

				<span className='shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-500'>
					{departmentStats.length} departamentos
				</span>
			</header>

			{sortedDepartments.length === 0 ? (
				<div className='flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center'>
					<MapPin size={24} className='mb-2 text-slate-300' />
					<p className='text-sm font-medium text-slate-600'>Sin datos territoriales</p>
					<p className='mt-1 text-xs text-slate-400'>
						Los departamentos aparecerán cuando haya registros disponibles.
					</p>
				</div>
			) : (
				<>
					<ol className='max-h-[340px] space-y-1 overflow-y-auto pr-1'>
						{sortedDepartments.map((item, index) => {
							const isSelected = selected === item.key;
							const percentage = (item.actas / max) * 100;
							const barColor = rankColors[index % rankColors.length];

							return (
								<li key={item.key}>
									<button
										type='button'
										onClick={() => onSelect(item.key)}
										aria-pressed={isSelected}
										title={`Seleccionar ${item.name} en el mapa`}
										className={`flex w-full min-w-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left transition-colors sm:gap-3 ${
											isSelected
												? 'bg-teal-50 ring-1 ring-inset ring-teal-100'
												: 'hover:bg-slate-50'
										}`}
									>
										<span
											className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
												index < 3 ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
											}`}
										>
											{String(index + 1).padStart(2, '0')}
										</span>

										<span className='w-[100px] shrink-0 truncate text-xs font-medium text-slate-700 sm:w-[112px] sm:text-sm'>
											{item.name}
										</span>

										<span className='relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100'>
											<span
												className='absolute inset-y-0 left-0 rounded-full transition-all duration-300'
												style={{
													width: `${percentage}%`,
													backgroundColor: barColor,
												}}
											/>
										</span>

										<span className='w-8 shrink-0 text-right text-xs font-bold tabular-nums text-slate-800'>
											{item.actas}
										</span>

										{isSelected && <ArrowUpRight size={14} className='shrink-0 text-teal-700' />}
									</button>
								</li>
							);
						})}
					</ol>

					<div className='mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3'>
						<p className='text-[10px] leading-4 text-slate-400'>
							Selecciona un departamento para resaltarlo en el mapa.
						</p>
						<span className='shrink-0 text-[10px] text-slate-400'>Datos de ejemplo</span>
					</div>
				</>
			)}
		</section>
	);
}
