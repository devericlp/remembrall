import { motion } from 'framer-motion';

type TypeCardProps = {
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    subtitle: string,
    color: string,
    onClick?: () => void
}

export default function TypeCard({ icon: IconComponent, title, subtitle, color, onClick }: TypeCardProps) {
    const Icon = IconComponent;
    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="w-full flex items-start gap-4 cursor-pointer p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all text-left"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="font-heading text-base font-bold text-foreground">{title}</p>
                <p className="font-body text-sm text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>
            </div>
        </motion.button>
    );
}



