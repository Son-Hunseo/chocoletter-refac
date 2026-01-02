package chocolate.chocoletter.common.converter;

import chocolate.chocoletter.common.annotation.DecryptedId;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.core.convert.converter.ConditionalGenericConverter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DecryptedIdConverter implements ConditionalGenericConverter {

    private final IdEncryptionUtil idEncryptionUtil;

    @Override
    public boolean matches(TypeDescriptor sourceType, TypeDescriptor targetType) {
        return targetType.hasAnnotation(DecryptedId.class);
    }

    @Override
    public Set<ConvertiblePair> getConvertibleTypes() {
        return Set.of(
                new ConvertiblePair(String.class, Long.class)
        );
    }

    @Override
    public Object convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType) {
        return idEncryptionUtil.decrypt((String) source);
    }
}

