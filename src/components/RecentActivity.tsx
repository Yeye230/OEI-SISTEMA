import Link from 'next/link';
import { Activity, ArrowUpRight, Clock, FileText, Layers, Monitor, Users } from 'lucide-react';
import { recentActivity, type ActivityItem } from '../core/utils/demo-data';

const kindStyle: Record<
	ActivityItem['kind'],
	{ icon: typeof FileText; bg: string; color: string }
> = {
	acta: { icon: FileText, bg: '#dcfce7', color: '#15803d' },
	equipo: { icon: Monitor, bg: '#dbeafe', color: '#1d4ed8' },
	pendiente: { icon: Clock, bg: '#fef3c7', color: '#b45309' },
	persona: { icon: Users, bg: '#ede9fe', color: '#6d28d9' },
	disponible: { icon: Layers, bg: '#e0f2fe', color: '#0369a1' },
};

const statusStyle: Record<ActivityItem['status'], { bg: string; color: string }> = {
	Completada: { bg: '#dcfce7', color: '#166534' },
	Entregado: { bg: '#dcfce7', color: '#166534' },
	Pendiente: { bg: '#fef3c7', color: '#92400e' },
	Registrada: { bg: '#ede9fe', color: '#6d28d9' },
	Disponible: { bg: '#dbeafe', color: '#1d4ed8' },
};

export default function RecentActivity() {
	return (
		<section className='dashboard-card min-w-0 p-4 sm:p-5'>
			<header className='dashboard-card-header mb-4'>
				<div className='flex min-w-0 items-center gap-3'>
					<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700'>
						<Activity size={18} />
					</span>

					<div className='min-w-0'>
						<h2 className='dashboard-card-title'>Actividad reciente</h2>
						<p className='mt-0.5 text-xs text-slate-500'>Últimos movimientos del sistema</p>
					</div>
				</div>

				<Link
					href='/actas'
					className='inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50'
				>
					Ver todas
					<ArrowUpRight size={14} />
				</Link>
			</header>

			{recentActivity.length === 0 ? (
				<div className='flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center'>
					<Activity size={25} className='mb-2 text-slate-300' />
					<p className='text-sm font-medium text-slate-600'>No hay movimientos recientes</p>
					<p className='mt-1 text-xs text-slate-400'>
						Las actividades aparecerán aquí cuando se registren.
					</p>
				</div>
			) : (
				<ul className='divide-y divide-slate-100'>
					{recentActivity.map((item, index) => {
						const { icon: Icon, bg, color } = kindStyle[item.kind];
						const status = statusStyle[item.status];

						return (
							<li
								key={`${item.title}-${item.time}-${index}`}
								className='group flex min-w-0 items-start gap-3 py-3 first:pt-1 last:pb-1'
							>
								<span
									className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl'
									style={{ backgroundColor: bg, color }}
								>
									<Icon size={17} />
								</span>

								<div className='min-w-0 flex-1 pt-0.5'>
									<p className='break-words text-sm font-semibold leading-5 text-slate-800'>
										{item.title}
									</p>
									<p className='mt-1 break-words text-xs leading-4 text-slate-500'>
										{item.subtitle}
									</p>
								</div>

								<div className='flex shrink-0 flex-col items-end gap-1.5 pt-0.5'>
									<span className='whitespace-nowrap text-[11px] text-slate-400'>{item.time}</span>

									<span
										className='whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold'
										style={{
											backgroundColor: status.bg,
											color: status.color,
										}}
									>
										{item.status}
									</span>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			<div className='mt-3 border-t border-slate-100 pt-3'>
				<p className='text-[10px] leading-4 text-slate-400'>
					Actividades de demostración. Pendiente de conectar con los movimientos reales del sistema.
				</p>
			</div>
		</section>
	);
}
