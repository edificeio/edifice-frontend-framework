import { UsefulLink } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyUsefulLinks from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import {
  ButtonBeta,
  EmptyScreen,
  Flex,
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
        <Flex justify="end" className="mb-16">
          <ButtonBeta
            type="button"
            variant="outline"
            leftIcon={<IconPlus />}
            onClick={onAddClick}
            disabled={!canAddLink}
          >
            {t('homepage.usefulLinks.modal.add', 'Ajouter un lien')}
          </ButtonBeta>
        </Flex>

        {links.length === 0 ? (
          <EmptyScreen
            imageSrc={illuEmptyUsefulLinks}
            size={135}
            title={t(
              'homepage.usefulLinks.modal.empty.title',
              'Pas encore de liens ajoutés',
            )}
            text={t(
              'homepage.usefulLinks.modal.empty.text',
              'Gardez à portée de main les sites web que vous utilisez souvent !',
            )}
          />
        ) : (
          <div className="useful-links-table">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="useful-links-table-name">
                    {t('homepage.usefulLinks.modal.table.name', 'Nom')}
                  </Table.Th>
                  <Table.Th className="useful-links-table-url">
                    {t('homepage.usefulLinks.modal.table.url', 'Adresse URL')}
                  </Table.Th>
                  <Table.Th>
                    <span className="visually-hidden">
                      {t('homepage.usefulLinks.modal.table.actions', 'Actions')}
                    </span>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {links.map((link) => (
                  <Table.Tr key={link.id}>
                    <Table.Td className="useful-links-table-name">
                      {link.name}
                    </Table.Td>
                    <Table.Td className="useful-links-table-url">
                      {link.url}
                    </Table.Td>
                    <Table.Td>
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
