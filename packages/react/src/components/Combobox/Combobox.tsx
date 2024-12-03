import { ChangeEvent, Fragment, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import ComboboxTrigger from "./ComboboxTrigger";
import { Dropdown } from "../Dropdown";
import { Loading } from "../Loading";

export interface ComboboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchResultsChange: (model: (string | number)[]) => void;
  onSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: OptionListItemType[];
  value: string;
  isLoading: boolean;
  noResult: boolean;
  searchMinLength?: number;
  placeholder?: string;
}

export interface OptionListItemType {
  /**
   * Value
   */
  value: string | number;
  /**
   * Label
   */
  label: string;
  /**
   * Add an icon
   */
  icon?: any;
}

const Combobox = ({
  onSearchResultsChange,
  onSearchInputChange,
  options,
  value,
  isLoading,
  noResult,
  searchMinLength,
  placeholder,
}: ComboboxProps) => {
  const { t } = useTranslation();

  const [localValue, setLocalValue] = useState<(string | number)[]>([]);

  useEffect(() => {
    onSearchResultsChange(localValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  const handleOptionClick = (value: string | number) => {
    setLocalValue([value]);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex align-items-center p-4">
          <Loading isLoading={isLoading} />
          <span className="ps-4">{t("explorer.search.pending")}</span>
        </div>
      );
    }

    if (noResult) {
      return <div className="p-4">{t("portal.no.result")}</div>;
    }

    return options.map((option, index) => (
      <Fragment key={index}>
        <Dropdown.Item
          type="select"
          icon={option.icon}
          onClick={() => handleOptionClick(option.value)}
        >
          {option.label}
        </Dropdown.Item>

        {index < options.length - 1 && <Dropdown.Separator />}
      </Fragment>
    ));
  };

  return (
    <Dropdown block>
      <Combobox.Trigger
        placeholder={placeholder}
        searchMinLength={searchMinLength}
        handleSearchInputChange={onSearchInputChange}
        value={value}
      />
      <Dropdown.Menu>{renderContent()}</Dropdown.Menu>
    </Dropdown>
  );
};

Combobox.Trigger = ComboboxTrigger;
Combobox.displayName = "Combobox";

export default Combobox;
