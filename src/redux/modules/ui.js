export const types = {
    TOGGLE_TOOLBAR: 'TOGGLE_TOOLBAR',
    TOGGLE_BACKLOG: 'TOGGLE_BACKLOG',
    TOGGLE_THEME: 'TOGGLE_THEME',
    RESTORE_INITIAL_STATE: 'RESTORE_INITIAL_STATE',
};

const initialState = {
    showToolbar: false,
    showBacklog: false,
    darkTheme: false,
};

function invertHex(hexnum){
  hexnum = hexnum.substring(hexnum.indexOf('#')+1);
  if(hexnum.length != 6) {
    alert("Hex color must be six hex numbers in length.");
    return false;
  }
    
  hexnum = hexnum.toUpperCase();
  var splitnum = hexnum.split("");
  var resultnum = "";
  var simplenum = "FEDCBA9876".split("");
  var complexnum = new Array();
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";
    
  for(let i=0; i<6; i++){
    if(!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]]; 
    } else if(complexnum[splitnum[i]]){
      resultnum += complexnum[splitnum[i]]; 
    } else {
      alert("Hex colors must only include hex numbers 0-9, and A-F");
      return false;
    }
  }
    
  return resultnum;
}

export const changeTheme = () => {
    //change colors
    let rootStyle = getComputedStyle(root);
    root.style.setProperty('--bg-color', "#" + invertHex(rootStyle.getPropertyValue('--bg-color')));
    root.style.setProperty('--pg-color', "#" + invertHex(rootStyle.getPropertyValue('--pg-color')));
    root.style.setProperty('--item-text', "#" + invertHex(rootStyle.getPropertyValue('--item-text')));
    root.style.setProperty('--board-inner-bg', "#" + invertHex(rootStyle.getPropertyValue('--board-inner-bg')));
    root.style.setProperty('--drag-bg', "#" + invertHex(rootStyle.getPropertyValue('--drag-bg')));
    root.style.setProperty('--due-date', "#" + invertHex(rootStyle.getPropertyValue('--due-date')));
    root.style.setProperty('--list-item-inner-bottom', "#" + invertHex(rootStyle.getPropertyValue('--list-item-inner-bottom')));
    root.style.setProperty('--list-item-spacer', "#" + invertHex(rootStyle.getPropertyValue('--list-item-spacer')));
    root.style.setProperty('--title-text', "#" + invertHex(rootStyle.getPropertyValue('--title-text')));
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.TOGGLE_TOOLBAR:
            // If we toggle the toolbar, we also close the backlog.
            const next = !state.showToolbar;
            if (next) {
                return { ...state, showToolbar: next };
            } else {
                return { ...state, showBacklog: false, showToolbar: next };
            }
        case types.TOGGLE_BACKLOG:
            return { ...state, showBacklog: !state.showBacklog };
        case types.TOGGLE_THEME:
            changeTheme();
            return { ...state, darkTheme: !state.darkTheme };
        case types.RESTORE_INITIAL_STATE:
            return initialState;
        default:
            return state;
    }
};

export const actions = {
    toggleToolbar: () => ({ type: types.TOGGLE_TOOLBAR }),
    toggleBacklog: () => ({ type: types.TOGGLE_BACKLOG }),
    toggleTheme: () => ({ type: types.TOGGLE_THEME }),
    restoreInitialState: () => ({ type: types.RESTORE_INITIAL_STATE }),
};
