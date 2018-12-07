import Todoist from '../../todoist-client/Todoist';
import { types, actions, isListBacklog } from '../modules/lists';
import List from '../../core/List';
import UndoBar from '../../components/UndoBar.js';

const todoistPersistenceMiddleware = store => next => action => {
    const state = store.getState();    const token = state.user.user.token;
    const project_id = state.lists.defaultProjectId;
    const projects = state.lists.projects;
    const defaultProject = projects.find(p => p.id === project_id);
    switch (action.type) {
        case types.MOVE_TO_LIST:
            function persistLabelChange() {
                if (UndoBar.isCancelled() == false){
                    const { toList, item, fromList } = action.payload;

                    // no-op if user puts item back where it was
                    if (toList.id === fromList.id) {
                        return;
                    }

                    // get all labels for item
                    const existingItemLabels = state.lists.lists
                        .filter(l => l.items.map(i => i.id).includes(item.id))
                        .map(l => l.id);

                    let labels = existingItemLabels;

                    if (!isListBacklog(fromList)) {
                        labels = labels.filter(l => l !== fromList.id);
                    }

                    if (!isListBacklog(toList)) {
                        labels = labels.push(toList.id);
                    }

                    labels = labels.toSet().toArray();

                    const updatedItem = { id: item.id, labels };
                    return Todoist.updateItem(token, updatedItem);
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistLabelChange()
            }, 5000);
            break;

        case types.ADD_LIST_ITEM:
            function persistAddListItem() {
                if (UndoBar.isCancelled() == false){
                    const { list, item } = action.payload;
                    const { content, temp_id } = item;

                    const labelString = isListBacklog(list) ? '' : `@${list.title.replaceAll(' ', '_').toLowerCase()}`;
                    const hasProjectSyntax = content.indexOf('#') >= 0;
                    const projectString =
                        hasProjectSyntax || !defaultProject ? '' : `#${defaultProject.name.replaceAll(' ', '')}`;

                    Todoist.quickAddItem(token, `${content} ${labelString} ${projectString}`, temp_id)
                        .then(() => store.dispatch(actions.fetchLists()))
                        .catch(err => console.error('could not add item', err));
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistAddListItem()
            }, 5000);

            break;

        case types.COMPLETE_LIST:
            function persistCompleteList() {
                if (UndoBar.isCancelled() == false){
                    const { list } = action.payload;
                    const itemIds = list.items.map(item => item.id);
                    Todoist.completeListItems(token, itemIds);
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistCompleteList()
            }, 5000);
            break;

        case types.DELETE_LIST:
            function deleteList() {
                if (UndoBar.isCancelled() == false){
                    const { list } = action.payload;
                    // Note: remove todoist label (deleting label does not appear to remove from items)
                    list.items.forEach(item => Todoist.updateItem(token, { id: item.id, labels: [] })); // TODO
                    if (!isListBacklog(list)) {
                        Todoist.deleteLabel(token, list.id);
                    }
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                deleteList()
            }, 5000);
            break;

        case types.COMPLETE_LIST_ITEM:
            function persistCompleteListItem() {
                if (UndoBar.isCancelled() == true){
                    store.dispatch(actions.fetchLists());
                }
                else {
                    const { item } = action.payload;
                    Todoist.completeListItem(token, item.id);
                } 
                UndoBar.hideBar();  
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistCompleteListItem()
            }, 5000);
            break;

        case types.UPDATE_LIST_ITEM:
            function persistContentChange() {
                if (UndoBar.isCancelled() == false){
                    const { item, text } = action.payload;
                    const updatedItem = { id: item.id, content: text };
                    Todoist.updateItem(token, updatedItem);
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistContentChange()
            }, 5000);
            break;

        case types.ADD_NEW_LIST:
            function persistAddLabel() {
                if(UndoBar.isCancelled() == false){
                    const { name, temp_id } = action.payload;

                    // TODO: un-duplicated in lists module
                    // prevent multiple lists from having the same name
                    let title = name;
                    let titleAlreadyUsed = state.lists.lists.map(list => list.title).contains(title);
                    while (titleAlreadyUsed) {
                        title = title + ' 2';
                        titleAlreadyUsed = state.lists.lists.map(list => list.title).contains(title);
                    }

                    const newLabel = { name: title, item_order: state.lists.lists.size + 1 };
                    Todoist.addLabel(token, newLabel, temp_id).then(response => {
                        store.dispatch({
                            type: types.UPDATE_ID,
                            payload: {
                                type: List,
                                old_id: temp_id,
                                new_id: response.temp_id_mapping[temp_id],
                            },
                        });
                    });
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistAddLabel()
            }, 5000);
            break;

        case types.RENAME_LIST:
            function persistLabelRename() {
                if(UndoBar.isCancelled() == false){
                    const { list, newListName } = action.payload;

                    // prevent multiple lists from having the same name
                    let title = newListName;
                    let titleAlreadyUsed = state.lists.lists.map(list => list.title).contains(title);
                    while (titleAlreadyUsed) {
                        title = title + ' 2';
                        titleAlreadyUsed = state.lists.lists.map(list => list.title).contains(title);
                    }

                    if (!isListBacklog(list)) {
                        Todoist.updateLabelName(token, list.id, title);
                    }
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistLabelRename()
            }, 5000);
            break;

        case types.REORDER_LIST:
            function persistListReorder() {
                if(UndoBar.isCancelled() == false){
                    // TODO: code duplicated from lists.js redux module.
                    const { lists } = state.lists;
                    const { list, newSibling } = action.payload;

                    const listIds = lists.map(el => el.id);
                    const currentIdx = listIds.indexOf(list.id);
                    const idxOfSibling = listIds.indexOf(newSibling.id);
                    const newIndex = currentIdx < idxOfSibling ? idxOfSibling : idxOfSibling + 1;

                    if (newIndex !== currentIdx) {
                        const labelOrderMap = listIds
                            .filter(el => el !== list.id)
                            .splice(newIndex, 0, list.id)
                            .filter(el => el !== 0)
                            .reduce((mapping, listId, idx) => {
                                mapping[listId] = idx;
                                return mapping;
                            }, {});

                        Todoist.updateLabelOrder(token, labelOrderMap);
                    }
                }
                else {
                    store.dispatch(actions.fetchLists());
                }
                UndoBar.hideBar();
            }
            UndoBar.showBar(action.type);
            setTimeout(() =>  {
                persistListReorder()
            }, 5000);
            break;
        default:
        // Nothing.
    }

    // Fire next action.
    next(action);
};

export default todoistPersistenceMiddleware;
