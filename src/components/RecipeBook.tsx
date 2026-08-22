import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  Utensils, 
  Heart, 
  Share2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Recipe } from '../types';
import { RECIPES_DATA } from '../data/recipesData';

interface RecipeBookProps {
  initialRecipeId?: string;
  onSelectRecipe?: (recipe: Recipe) => void;
  onOpenOrder: () => void;
  onOpenChat: () => void;
}

export const RecipeBook: React.FC<RecipeBookProps> = ({
  initialRecipeId,
  onSelectRecipe,
  onOpenOrder,
  onOpenChat
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [activeRecipeId, setActiveRecipeId] = useState<string>(initialRecipeId || RECIPES_DATA[0].id);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'todas', label: 'Todas las Recetas', icon: '✨' },
    { id: 'tiroides', label: 'Tiroides & Metabolismo', icon: '🦋' },
    { id: 'hormonas', label: 'Hormonas & Sofocos', icon: '🌸' },
    { id: 'digestivo', label: 'Digestión & Detox', icon: '🌿' },
    { id: 'energia', label: 'Energía & Saciedad', icon: '⚡' },
    { id: 'noche', label: 'Descanso & Sueño', icon: '🌙' },
  ];

  const filteredRecipes = selectedCategory === 'todas'
    ? RECIPES_DATA
    : RECIPES_DATA.filter(r => r.category === selectedCategory);

  const activeRecipe = RECIPES_DATA.find(r => r.id === activeRecipeId) || RECIPES_DATA[0];

  const toggleIngredient = (ingText: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [`${activeRecipe.id}-${ingText}`]: !prev[`${activeRecipe.id}-${ingText}`]
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Recetario Funcional Tyruss Full</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury">
            Combinaciones & Batidos de Marié 🍏🍍
          </h2>
          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Potencia los superalimentos de tu Tyruss Full (espirulina, chlorella, selenio y colágeno) con frutas funcionales, hierbas y grasas saludables para cada momento de tu día.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Recipe Grid / Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recipe List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Recetas Disponibles ({filteredRecipes.length})
          </h3>
          <div className="space-y-2.5">
            {filteredRecipes.map((rec) => {
              const isSelected = rec.id === activeRecipe.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setActiveRecipeId(rec.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800">
                      {rec.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.prepTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                    <span>{rec.tag}</span>
                    <span className="text-slate-400">Ver receta →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Recipe Detail (Right 7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6 sticky top-24">
            {/* Header Banner */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {activeRecipe.categoryLabel}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {activeRecipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {activeRecipe.servings}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-luxury">
                {activeRecipe.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeRecipe.description}
              </p>
            </div>

            {/* Clinical Benefit Highlight */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Beneficio Clínico & Hormonal:</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                {activeRecipe.clinicalBenefit}
              </p>
            </div>

            {/* Ingredients Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span>Ingredientes Necesarios</span>
                </h4>
                <span className="text-[11px] text-slate-400">Toca para tachar</span>
              </div>

              <div className="space-y-2">
                {activeRecipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[`${activeRecipe.id}-${ing}`];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleIngredient(ing)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isChecked 
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                          : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="leading-tight">{ing}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Preparation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Modo de Preparación Paso a Paso
              </h4>

              <div className="space-y-3">
                {activeRecipe.stepByStep.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onOpenChat}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>¿Pregunta a Marié sobre esta receta?</span>
              </button>

              <button
                onClick={onOpenOrder}
                className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Pedir Tyruss Full para mis Batidos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
