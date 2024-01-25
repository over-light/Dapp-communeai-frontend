import * as React from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';

import { List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Sheet, Typography } from '@mui/joy';
import FolderIcon from '@mui/icons-material/Folder';

import { DFolder, useFolderStore } from '~/common/state/store-folders';

import { AddFolderButton } from './AddFolderButton';
import { FolderListItem } from './FolderListItem';
import { StrictModeDroppable } from './StrictModeDroppable';


export function ChatFolderList(props: {
  folders: DFolder[];
  onFolderSelect: (folderId: string | null) => void;
  selectedFolderId: string | null;
}) {

  // derived props
  const { folders, onFolderSelect, selectedFolderId } = props;

  // handlers

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    useFolderStore.getState().moveFolder(result.source.index, result.destination.index);
  };


  return (
    <Sheet variant='soft' sx={{ p: 2 }}>
      <List
        variant='plain'
        sx={(theme) => ({
          '& ul': {
            '--List-gap': '0px',
            bgcolor: 'background.surface',
            '& > li:first-of-type > [role="button"]': {
              borderTopRightRadius: 'var(--List-radius)',
              borderTopLeftRadius: 'var(--List-radius)',
            },
            '& > li:last-child > [role="button"]': {
              borderBottomRightRadius: 'var(--List-radius)',
              borderBottomLeftRadius: 'var(--List-radius)',
            },
          },
          // copied from the former PageDrawerList as this was contained
          '--Icon-fontSize': 'var(--joy-fontSize-xl2)',
          '--ListItemDecorator-size': '2.75rem',
          '--ListItem-minHeight': '3rem', // --Folder-ListItem-height

          '--List-radius': '8px',
          '--List-gap': '1rem',
          '--ListDivider-gap': '0px',
          // '--ListItem-paddingY': '0.5rem',
          // override global variant tokens
          '--joy-palette-neutral-plainHoverBg': 'rgba(0 0 0 / 0.08)',
          '--joy-palette-neutral-plainActiveBg': 'rgba(0 0 0 / 0.12)',
          [theme.getColorSchemeSelector('light')]: {
            '--joy-palette-divider': 'rgba(0 0 0 / 0.08)',
          },
          [theme.getColorSchemeSelector('dark')]: {
            '--joy-palette-neutral-plainHoverBg': 'rgba(255 255 255 / 0.1)',
            '--joy-palette-neutral-plainActiveBg': 'rgba(255 255 255 / 0.16)',
          },
        })}
      >
        <ListItem nested>
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable
              droppableId='folder'
              renderClone={(provided, snapshot, rubric) => (
                <FolderListItem
                  folder={folders[rubric.source.index]}
                  provided={provided}
                  snapshot={snapshot}
                  onFolderSelect={onFolderSelect}
                  selectedFolderId={selectedFolderId}
                />
              )}
            >
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps}>

                  {/* First item is the 'All' button */}
                  <ListItem>
                    <ListItemButton
                      // handle folder select
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent the ListItemButton's onClick from firing
                        onFolderSelect(null);
                      }}
                      selected={selectedFolderId === null}
                      sx={{
                        border: 0,
                        justifyContent: 'space-between',
                        '&:hover .menu-icon': {
                          visibility: 'visible', // Hide delete icon for default folder
                        },
                      }}
                    >
                      <ListItemDecorator>
                        <FolderIcon />
                      </ListItemDecorator>

                      <ListItemContent>
                        <Typography>All</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>

                  {folders.map((folder, index) => (
                    <Draggable key={folder.id} draggableId={folder.id} index={index}>
                      {(provided, snapshot) => (
                        <FolderListItem
                          folder={folder}
                          provided={provided}
                          snapshot={snapshot}
                          onFolderSelect={onFolderSelect}
                          selectedFolderId={selectedFolderId}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </ListItem>
      </List>

      <AddFolderButton />
    </Sheet>
  );
}
