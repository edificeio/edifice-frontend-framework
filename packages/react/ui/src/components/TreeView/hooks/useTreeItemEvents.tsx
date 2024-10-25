export default function useTreeItemEvents(
  nodeId: string,
  label: string,
  expanded: boolean,
  setExpanded: Function,
  onItemSelect: Function | undefined,
  onItemFold: Function | undefined,
  onItemUnfold: Function | undefined,
  onItemFocus: Function | undefined,
  onItemBlur: Function | undefined,
) {
  const handleItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onItemSelect?.(nodeId);
    itemFoldUnfold();
    event.stopPropagation();
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      onItemSelect?.(nodeId);
      itemFoldUnfold();
      event.stopPropagation();
    }
  };

  const itemFoldUnfold = () => {
    setExpanded(!expanded);
    expanded ? onItemFold?.(nodeId) : onItemUnfold?.(nodeId);
  };

  const handleItemFoldUnfoldClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    itemFoldUnfold();
    event.stopPropagation();
  };

  const handleItemFoldUnfoldKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      itemFoldUnfold();
      event.stopPropagation();
    }
  };

  const handleItemFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    event.preventDefault();
    onItemFocus?.(nodeId);
    // no need to stop propagation because focus event does not bubble
  };

  const handleItemBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    event.preventDefault();
    onItemBlur?.(nodeId);
    // no need to stop propagation because blur event does not bubble
  };

  return {
    handleItemClick,
    handleItemKeyDown,
    handleItemFoldUnfoldClick,
    handleItemFoldUnfoldKeyDown,
    handleItemFocus,
    handleItemBlur,
  };
}
