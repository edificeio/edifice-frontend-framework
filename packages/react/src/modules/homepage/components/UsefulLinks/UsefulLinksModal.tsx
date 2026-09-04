import { UsefulLink } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyUsefulLinks from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import {
  ButtonBeta,
  Flex,
  Image,
  ModalBeta,
  Table,
} from '../../../../components';
import { IconClose, IconEdit, IconPlus } from '../../../icons/components';

export interface UsefulLinksModalProps {
  isOpen: boolean;
  links: UsefulLink[];
  canAddLink: boolean;
  onClose: () => void;
  onAddClick: () => void;
  onEditLink: (link: UsefulLink) => void;
  onDeleteLink: (id: string) => void;
}

export function UsefulLinksModal({
  isOpen,
  links,
  canAddLink,
  onClose,
  onAddClick,
  onEditLink,
  onDeleteLink,
}: UsefulLinksModalProps) {
  const { t } = useTranslation();

  const addLinkButton = (
    <ButtonBeta
      type="button"
      variant="outline"
      leftIcon={<IconPlus />}
      onClick={onAddClick}
      disabled={!canAddLink}
    >
      {t('homepage.usefulLinks.modal.add', 'Ajouter un lien')}
    </ButtonBeta>
  );

  return (
    <ModalBeta
      id="useful-links-modal"
      isOpen={isOpen}
      size="l"
      onModalClose={onClose}
    >
      <ModalBeta.Header onModalClose={onClose}>
        {t('homepage.usefulLinks.modal.title', 'Gérer les liens utiles')}
      </ModalBeta.Header>
      <ModalBeta.Body>
        {links.length === 0 ? (
          <>
            <Flex justify="end" className="mb-16">
              {addLinkButton}
            </Flex>
            <div className="useful-links-modal-empty">
              <Image
                src={illuEmptyUsefulLinks}
                alt=""
                aria-hidden="true"
                style={{ width: 200, height: 109 }}
              />
              <p className="useful-links-modal-empty-title">
                {t(
                  'homepage.usefulLinks.modal.empty.title',
                  'Pas encore de liens ajoutés',
                )}
              </p>
              <p className="useful-links-modal-empty-text">
                {t(
                  'homepage.usefulLinks.modal.empty.text',
                  'Gardez à portée de main les sites web que vous utilisez souvent !',
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="useful-links-table">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="visually-hidden">
                    {t('homepage.usefulLinks.modal.table.name', 'Nom')}
                  </Table.Th>
                  <Table.Th className="visually-hidden">
                    {t('homepage.usefulLinks.modal.table.url', 'Adresse URL')}
                  </Table.Th>
                  <Table.Th className="visually-hidden">
                    {t('homepage.usefulLinks.modal.table.actions', 'Actions')}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr className="useful-links-table-action-row">
                  <Table.Td colSpan={3}>
                    <Flex justify="end">{addLinkButton}</Flex>
                  </Table.Td>
                </Table.Tr>
                {links.map((link) => (
                  <Table.Tr key={link.id}>
                    <Table.Td className="useful-links-table-name">
                      {link.name}
                    </Table.Td>
                    <Table.Td className="useful-links-table-url">
                      {link.url}
                    </Table.Td>
                    <Table.Td className="useful-links-table-actions">
                      <Flex gap="4" justify="end">
                        <ButtonBeta
                          type="button"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          leftIcon={<IconEdit />}
                          aria-label={t(
                            'homepage.usefulLinks.modal.table.edit',
                            'Modifier [[name]]',
                            { name: link.name },
                          )}
                          onClick={() => onEditLink(link)}
                        />
                        <ButtonBeta
                          type="button"
                          variant="ghost"
                          color="tertiary"
                          size="sm"
                          leftIcon={<IconClose />}
                          aria-label={t(
                            'homepage.usefulLinks.modal.table.delete',
                            'Supprimer [[name]]',
                            { name: link.name },
                          )}
                          onClick={() => onDeleteLink(link.id)}
                        />
                      </Flex>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </ModalBeta.Body>
    </ModalBeta>
  );
}
