export const updateRinnaiUserAWS = /* GraphQL */ `
    mutation UpdateRinnaiUser($input: UpdateRinnaiUserInput!, $condition: ModelRinnaiUserConditionInput) {
        updateRinnaiUser(input: $input, condition: $condition) {
            id
            email
            aws_confirm
        }
    }
`;

export const updateUserTerms = /* GraphQL */ `
    mutation UpdateRinnaiUser($input: UpdateRinnaiUserInput!, $condition: ModelRinnaiUserConditionInput) {
        updateRinnaiUser(input: $input, condition: $condition) {
            id
            terms_accepted
            terms_accepted_at
        }
    }
`;
