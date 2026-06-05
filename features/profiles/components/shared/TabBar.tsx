interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}  

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
    return (
        <div className="px-8 border-b border-gray-700 pt-10">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-white border-purple-500"
                    : "text-gray-400 hover:text-gray-200 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
    )
}