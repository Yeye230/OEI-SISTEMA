'use client';

import { useState } from 'react';
import { BarChart3, CalendarDays, ChevronDown } from 'lucide-react';
import { monthlyData } from '../core/utils/demo-data';

const PERIODS = [
	{ label: 'Últimos 6 meses', months: 6 },
	{ label: 'Últimos 3 meses', months: 3 },
] as const;

export default function MonthlyChart() {
	const [period, setPeriod] = useState(6);

	const data = monthlyData.slice(-period);
	const maxValue = Math.max(1, ...data.map((item) => item.value));
	const chartMax = Math.ceil(maxValue / 10) * 10;
	const ticks = [chartMax, chartMax * 0.75, chartMax * 0.5, chartMax * 0.25, 0];

	return (
		<section className='min-w-0'>
			<div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
				<div className='flex min-w-0 items-center gap-2'>
					<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700'>
						<BarChart3 size={17} />
					</span>

					<div className='min-w-0'>
						<h3 className='text-sm font-bold text-[#102b49]'>Actas por mes</h3>
						<p className='text-xs text-slate-500'>Tendencia de los registros</p>
					</div>
				</div>

				<label className='relative inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600'>
					<CalendarDays size={14} className='text-slate-400' />

					<select
						aria-label='Periodo de la gráfica'
						value={period}
						onChange={(event) => setPeriod(Number(event.target.value))}
						className='max-w-[125px] appearance-none bg-transparent pr-4 outline-none'
					>
						{PERIODS.map((item) => (
							<option key={item.months} value={item.months}>
								{item.label}
							</option>
						))}
					</select>

					<ChevronDown size={13} className='pointer-events-none absolute right-2 text-slate-400' />
				</label>
			</div>

			{data.length === 0 ? (
				<div className='flex min-h-[180px] items-center justify-center rounded-xl bg-slate-50 px-4 text-center text-sm text-slate-500'>
					No hay datos disponibles para mostrar.
				</div>
			) : (
				<div className='min-w-0'>
					<div className='flex gap-2'>
						<div className='flex h-[185px] w-7 shrink-0 flex-col justify-between pb-1 text-right text-[10px] text-slate-400'>
							{ticks.map((tick, index) => (
								<span key={index}>{Math.round(tick)}</span>
							))}
						</div>

						<div className='min-w-0 flex-1'>
							<div className='relative h-[185px]'>
								{/* Líneas de referencia */}
								<div className='pointer-events-none absolute inset-0 flex flex-col justify-between pb-1'>
									{ticks.map((tick, index) => (
										<div key={index} className='border-t border-dashed border-slate-200' />
									))}
								</div>

								{/* Barras */}
								<div className='absolute inset-0 flex items-end justify-around gap-1 px-1 pb-1 sm:gap-2'>
									{data.map((item) => {
										const height = (item.value / chartMax) * 100;

										return (
											<div
												key={item.month}
												className='flex h-full min-w-0 flex-1 flex-col items-center justify-end'
											>
												<span className='mb-1 text-[10px] font-semibold tabular-nums text-slate-600 sm:text-xs'>
													{item.value}
												</span>

												<div
													title={`${item.month}: ${item.value} actas`}
													className='w-full max-w-[42px] rounded-t-md transition-all duration-200 hover:brightness-110'
													style={{
														height: `${height}%`,
														minHeight: item.value > 0 ? '3px' : '0',
														background: `linear-gradient(180deg, ${item.to} 0%, ${item.from} 100%)`,
													}}
												/>
											</div>
										);
									})}
								</div>
							</div>

							{/* Meses */}
							<div className='mt-2 flex justify-around gap-1'>
								{data.map((item) => (
									<span
										key={item.month}
										className='min-w-0 flex-1 truncate text-center text-[10px] text-slate-500 sm:text-xs'
									>
										{item.month}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			<p className='mt-3 text-[10px] leading-4 text-slate-400'>
				Valores actuales de demostración. Pendiente de conectar con los registros reales.
			</p>
		</section>
	);
}
