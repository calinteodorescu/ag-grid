import { CssClassManager } from '@ag-grid-community/core';
import { createMemo, createSignal, onMount } from 'solid-js';
import UserComp from '../userComps/userComp';
const HeaderCellComp = (props) => {
    const { ctrl } = props;
    const [getWidth, setWidth] = createSignal();
    const [getColId, setColId] = createSignal(ctrl.getColId());
    const [getAriaSort, setAriaSort] = createSignal();
    const [getUserCompDetails, setUserCompDetails] = createSignal();
    let eGui;
    let eResize;
    let eHeaderCompWrapper;
    let userComp;
    const setRef = (ref) => {
        userComp = ref;
    };
    const cssClassManager = new CssClassManager(() => eGui);
    onMount(() => {
        const compProxy = {
            setWidth: width => setWidth(width),
            addOrRemoveCssClass: (name, on) => cssClassManager.addOrRemoveCssClass(name, on),
            setAriaSort: sort => setAriaSort(sort),
            setUserCompDetails: compDetails => setUserCompDetails(compDetails),
            getUserCompInstance: () => userComp
        };
        ctrl.setComp(compProxy, eGui, eResize, eHeaderCompWrapper);
        const selectAllGui = ctrl.getSelectAllGui();
        eResize.insertAdjacentElement('afterend', selectAllGui);
        ctrl.setDragSource(eGui);
    });
    const style = createMemo(() => ({ width: getWidth() }));
    return (<div ref={eGui} class="ag-header-cell" style={style()} col-id={getColId()} aria-sort={getAriaSort()} role="columnheader">
            <div ref={eResize} class="ag-header-cell-resize" role="presentation"></div>
            <div ref={eHeaderCompWrapper} class="ag-header-cell-comp-wrapper" role="presentation">
            {getUserCompDetails()
            && <UserComp compDetails={getUserCompDetails()} ref={setRef}/>}
            </div>
        </div>);
};
export default HeaderCellComp;
