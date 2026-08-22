package com.securevault.specification;

import org.springframework.data.jpa.domain.Specification;

import com.securevault.enums.Category;
import com.securevault.entity.Credential;

public class CredentialSpecification {

    public static Specification<Credential> filterCredentials(
            Long userId,
            Category category,
            String title,
            String username,
            String website) {

        return (root, query, criteriaBuilder) -> {

            Specification<Credential> spec = Specification.where(
                    (root1, query1, cb) -> cb.equal(root1.get("user").get("id"), userId));

            spec = spec.and(
                    (root1, query1, cb) -> cb.isFalse(root1.get("deleted")));
            if (category != null) {
                spec = spec.and((r, q, cb) -> cb.equal(r.get("category"), category));
            }

            if (title != null && !title.isBlank()) {
                spec = spec.and((r, q, cb) -> cb.like(
                        cb.lower(r.get("title")),
                        "%" + title.toLowerCase() + "%"));
            }

            if (username != null && !username.isBlank()) {
                spec = spec.and((r, q, cb) -> cb.like(
                        cb.lower(r.get("username")),
                        "%" + username.toLowerCase() + "%"));
            }

            if (website != null && !website.isBlank()) {
                spec = spec.and((r, q, cb) -> cb.like(
                        cb.lower(r.get("websiteUrl")),
                        "%" + website.toLowerCase() + "%"));
            }

            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }
}