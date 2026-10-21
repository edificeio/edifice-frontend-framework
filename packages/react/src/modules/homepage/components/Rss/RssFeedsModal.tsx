import { useTranslation } from 'react-i18next';

import illuEmptyFeeds from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import {
  ButtonBeta as Button,
  Image,
  ModalBeta,
  Table,
} from '../../../../components';
import { useBreakpoint } from '../../../../hooks';
import { IconClose, IconEdit, IconPlus } from '../../../icons/components';
import { RssFeed } from './types';

export interface RssFeedsModalProps {
  isOpen: boolean;
  feeds: RssFeed[];
  canAddFeed: boolean;
  onClose: () => void;
  onAddClick: () => void;
  onEditFeed: (index: number) => void;
  onDeleteFeed: (index: number) => void;
}

export function RssFeedsModal({
  isOpen,
  feeds,
  canAddFeed,
  onClose,
  onAddClick,
  onEditFeed,
  onDeleteFeed,
}: RssFeedsModalProps) {
  const { t } = useTranslation();
  const { md } = useBreakpoint();
  // The URL column is hidden below the tablet breakpoint.
  const columnCount = md ? 3 : 2;

  return (
    <ModalBeta
      id="rss-feeds-modal"
      isOpen={isOpen}
      size="l"
      onModalClose={onClose}
    >
      <ModalBeta.Header onModalClose={onClose}>
        {t('homepage.widget.rss.modal.title')}
      </ModalBeta.Header>
      <ModalBeta.Body>
        <div className="rss-widget-table">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="visually-hidden">
                  {t('homepage.widget.rss.modal.table.name')}
                </Table.Th>
                <Table.Th className="visually-hidden">
                  {t('homepage.widget.rss.modal.table.url')}
                </Table.Th>
                <Table.Th className="visually-hidden">
                  {t('homepage.widget.rss.modal.table.actions')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr className="rss-widget-table__action-row">
                <Table.Td colSpan={columnCount}>
                  <div className="rss-widget-table__toolbar">
                    <Button
                      type="button"
                      variant="outline"
                      leftIcon={<IconPlus />}
                      onClick={onAddClick}
                      disabled={!canAddFeed}
                      data-testid="rss-button-add-feed"
                    >
                      {t('homepage.widget.rss.modal.add')}
                    </Button>
                  </div>
                </Table.Td>
              </Table.Tr>
              {feeds.length === 0 ? (
                <Table.Tr className="rss-widget-table__empty-row">
                  <Table.Td colSpan={columnCount}>
                    <div className="rss-widget-table__empty">
                      <Image
                        src={illuEmptyFeeds}
                        alt=""
                        aria-hidden="true"
                        className="rss-widget-table__empty-image"
                      />
                      <p className="rss-widget-table__empty-title">
                        {t('homepage.widget.rss.modal.empty.title')}
                      </p>
                      <p className="rss-widget-table__empty-text">
                        {t('homepage.widget.rss.empty')}
                      </p>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                feeds.map((feed, index) => (
                  <Table.Tr
                    key={`${feed.link}-${index}`}
                    data-testid={`rss-row-${index}`}
                  >
                    <Table.Td className="rss-widget-table__name">
                      {feed.title}
                    </Table.Td>
                    <Table.Td className="rss-widget-table__url">
                      {feed.link}
                    </Table.Td>
                    <Table.Td className="rss-widget-table__actions">
                      <div className="rss-widget-table__actions-buttons">
                        <Button
                          type="button"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          leftIcon={<IconEdit />}
                          aria-label={t(
                            'homepage.widget.rss.modal.table.edit',
                            {
                              title: feed.title,
                            },
                          )}
                          data-testid={`rss-button-edit-${index}`}
                          onClick={() => onEditFeed(index)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          leftIcon={<IconClose />}
                          aria-label={t(
                            'homepage.widget.rss.modal.table.delete',
                            { title: feed.title },
                          )}
                          data-testid={`rss-button-delete-${index}`}
                          onClick={() => onDeleteFeed(index)}
                        />
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </ModalBeta.Body>
    </ModalBeta>
  );
}
