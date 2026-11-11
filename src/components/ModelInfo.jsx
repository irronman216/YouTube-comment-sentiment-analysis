import React from 'react'
import { Cpu, TrendingUp, Users, Sparkles, ExternalLink } from 'lucide-react'

export default function ModelInfo({ id }) {
  const ladder = [
    {
      stage: 'Stage A',
      model: 'Linear SGD / Logistic',
      input: 'Frozen 384-d',
      acc: '65.2%',
      desc: 'Linear baseline ceiling'
    },
    {
      stage: 'Stage B',
      model: 'PyTorch MLP Head',
      input: 'Frozen 384-d',
      acc: '71.1%',
      desc: '+5.9% non-linear gain'
    },
    {
      stage: 'Stage C',
      model: 'DistilRoBERTa (Fine-tuned)',
      input: 'Raw text tokens',
      acc: '77.6%',
      highlight: true,
      desc: '+6.5% encoder adaptation'
    },
  ]

  return (
    <section id={id} className="py-14 border-t border-indigo-100 dark:border-slate-800 bg-white/70 dark:bg-[#0B0F19]/60 transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 space-y-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IML Research Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold font-head text-ink dark:text-white">
            Experimental Progression & Model Specs
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Introduction to Machine Learning end-semester project evaluating frozen embeddings versus partially fine-tuned transformer encoders.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Model Specs */}
          <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold font-head text-ink dark:text-white">Headline Model Architecture</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                <strong className="text-ink dark:text-white">distilroberta-base</strong> (6 transformer layers, 768 hidden dimension). Top 3 of 6 layers unfrozen for task-specific semantic alignment; bottom layers frozen.
              </p>

              <div className="mt-5 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <span>Pooling Strategy</span>
                  <span className="font-semibold text-ink dark:text-white">CLS Token [:, 0, :]</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <span>Classification Head</span>
                  <span className="font-semibold text-ink dark:text-white">768 → 256 → 128 → 3</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <span>Token Sequence Length</span>
                  <span className="font-semibold text-ink dark:text-white">128 max tokens</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-indigo-50 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
              Evaluated on 102,912 isolated test comments.
            </div>
          </div>

          {/* Card 2: Experimental Ladder */}
          <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold font-head text-ink dark:text-white">Accuracy Benchmark Ladder</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Rigorous empirical step-up demonstrating the value of each added model component.
              </p>

              <div className="mt-5 space-y-3">
                {ladder.map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${item.highlight
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.stage}</span>
                        <span className="text-xs font-bold text-ink dark:text-white">{item.model}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400">{item.desc}</span>
                    </div>
                    <span className={`text-base font-extrabold font-head ${item.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.acc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-indigo-50 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
              Balanced 3-class distribution (~34.2k samples/class).
            </div>
          </div>

          {/* Card 3: Research Team & Scope */}
          <div className="bg-white dark:bg-[#131B2E] border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold font-head text-ink dark:text-white">Project Team & Scope</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Introduction to Machine Learning End-Semester Research Project.
              </p>

              <div className="mt-5 space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-indigo-50 dark:border-slate-800">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 block mb-1.5">Research Authors</span>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-ink dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      Krish Prajapati
                    </p>
                    <p className="text-xs font-bold text-ink dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      Avinash A
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-[11px] font-semibold uppercase text-indigo-900 dark:text-indigo-300 block mb-1">Target Benchmark</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Macro F1 score of <strong className="text-indigo-950 dark:text-white">0.78</strong> & overall test accuracy of <strong className="text-indigo-950 dark:text-white">77.57%</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-indigo-50 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500">IML Fall 2026</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
