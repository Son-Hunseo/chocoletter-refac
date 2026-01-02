import { useRecoilState } from 'recoil';
import { selectedGiftTypeAtom } from '../../../atoms/gift/giftAtoms';

export const FilterButton = () => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedGiftTypeAtom);

    const options = [
        { id: "all", label: "전체" },
        { id: "general", label: "일반" },
        { id: "special", label: "특별" },
    ];

    return (
    <div className="flex gap-2">
        {options.map((option) => (
        <label
            key={option.id}
            className={`cursor-pointer px-2 pb-1 hover:text-chocoletterYellow text-md
            ${
                selectedValue === option.id
                ? "text-chocoletterYellow texthi border-b-2 border-chocoletterYellow"
                : "text-white"
            }`}
        >
            <input
            type="radio"
            name="chip-radio"
            value={option.id}
            checked={selectedValue === option.id}
            onChange={() => setSelectedValue(option.id as "all" | "general" | "special")}
            className="hidden"
            />
            {option.label}
        </label>
        ))}
    </div>
    );
};